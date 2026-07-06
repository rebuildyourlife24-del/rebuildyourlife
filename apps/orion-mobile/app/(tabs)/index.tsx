import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

export default function RedBlackBoxMobile() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [activeAgent, setActiveAgent] = useState('ORION_CORE');
  const [agentRole, setAgentRole] = useState('Supreme AI Partner');
  const [emotion, setEmotion] = useState('CALM');

  useEffect(() => {
    // Request audio permissions on load
    Audio.requestPermissionsAsync();
  }, []);

  async function startRecording() {
    try {
      const permission = await Audio.getPermissionsAsync();
      if (permission.status !== 'granted') {
        const req = await Audio.requestPermissionsAsync();
        if (req.status !== 'granted') return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    setIsRecording(false);
    setRecording(null);

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (!uri) return;

      setIsProcessing(true);

      // 1. Send the audio to our live Vercel Whisper transcription endpoint
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'audio.m4a',
        type: 'audio/m4a',
      } as any);

      const transcribeRes = await fetch('https://rebuildyourlife.eu/api/voice/transcribe', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!transcribeRes.ok) {
        throw new Error('Transcription failed');
      }

      const transcribeData = await transcribeRes.json();
      if (!transcribeData.text) {
        throw new Error('No transcription returned');
      }

      setTranscribedText(transcribeData.text);

      // 2. Post the transcribed command to our Vercel Command Center Orion endpoint
      const orionRes = await fetch('https://cc.ai-henksemler.nl/api/orion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: transcribeData.text,
        }),
      });

      if (!orionRes.ok) {
        throw new Error('Orion routing failed');
      }

      const orionData = await orionRes.json();
      if (orionData.response) {
        setAiResponse(orionData.response);
        setActiveAgent(orionData.agent || 'ORION_CORE');
        setEmotion(orionData.emotion || 'CALM');
        if (orionData.agentInfo) {
          setAgentRole(orionData.agentInfo.role);
        }
      }

    } catch (err: any) {
      console.error('Processing error:', err);
      setAiResponse(`Uplink fout: ${err.message || 'Probeer opnieuw.'}`);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.superTitle}>ORION OMNIPRESENCE</Text>
          <Text style={styles.title}>Voice Link</Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>UPLINK READY</Text>
        </View>
      </View>

      {/* Main J.A.R.V.I.S. Orb UI */}
      <View style={styles.orbCard}>
        <Text style={styles.orbLabel}>ORION CORE UPLINK STATUS</Text>
        
        {/* Pulsating Orb Button */}
        <View style={styles.orbContainer}>
          <TouchableOpacity 
            onPressIn={startRecording}
            onPressOut={stopRecording}
            activeOpacity={0.8}
            style={[
              styles.orb,
              isRecording && styles.orbRecording,
              isProcessing && styles.orbProcessing
            ]}
          >
            {isProcessing ? (
              <ActivityIndicator color="#06b6d4" size="large" />
            ) : (
              <View style={[styles.innerOrb, isRecording && styles.innerOrbRecording]} />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.orbInstruction}>
          {isRecording 
            ? 'Orion luistert... Laat los om te verzenden.' 
            : isProcessing 
              ? 'Transcriberen & Agent Routeren...' 
              : 'Houd de knop ingedrukt om te praten'}
        </Text>
      </View>

      {/* Voice Transcript Card */}
      {transcribedText ? (
        <View style={styles.transcriptCard}>
          <Text style={styles.cardHeader}>HENDRIK (GEBRUIKER):</Text>
          <Text style={styles.transcriptText}>"{transcribedText}"</Text>
        </View>
      ) : null}

      {/* Agent Response Card */}
      {aiResponse ? (
        <View style={[styles.responseCard, isProcessing && { opacity: 0.5 }]}>
          <View style={styles.responseHeaderContainer}>
            <Text style={styles.responseAgent}>{activeAgent}</Text>
            <View style={[styles.emotionTag, { borderColor: emotion === 'ALERT' ? '#ef4444' : '#10b981' }]}>
              <Text style={[styles.emotionText, { color: emotion === 'ALERT' ? '#ef4444' : '#10b981' }]}>{emotion}</Text>
            </View>
          </View>
          <Text style={styles.responseRole}>{agentRole}</Text>
          <Text style={styles.responseText}>{aiResponse}</Text>
        </View>
      ) : (
        <View style={styles.responsePlaceholder}>
          <Text style={styles.placeholderText}>Druk op de knop om spraak-commando's direct te sturen naar het AI-team.</Text>
        </View>
      )}

      {/* Quick Status Stats */}
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>SWARM AGENTS</Text>
          <Text style={styles.gridValue}>27 ACTIEF</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>SPEECH ENGINE</Text>
          <Text style={[styles.gridValue, {color: '#06b6d4'}]}>WHISPER V3</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Pitch Black
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  superTitle: {
    color: '#ef4444', // Red-500
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#06b6d4',
    marginRight: 6,
  },
  statusText: {
    color: '#06b6d4',
    fontSize: 10,
    fontWeight: 'bold',
  },
  orbCard: {
    backgroundColor: '#050505',
    borderColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  orbLabel: {
    color: '#52525b',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  orbContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbRecording: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    transform: [{ scale: 1.15 }],
  },
  orbProcessing: {
    borderColor: '#06b6d4',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  innerOrb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ef4444',
    opacity: 0.6,
  },
  innerOrbRecording: {
    opacity: 1,
    transform: [{ scale: 0.85 }],
  },
  orbInstruction: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 20,
    fontFamily: 'System',
  },
  transcriptCard: {
    backgroundColor: '#0a0a0a',
    borderColor: '#27272a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    color: '#a1a1aa',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 6,
  },
  transcriptText: {
    color: '#ffffff',
    fontSize: 14,
    fontStyle: 'italic',
  },
  responseCard: {
    backgroundColor: '#080808',
    borderColor: '#18181b',
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  responseHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  responseAgent: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  emotionTag: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  emotionText: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  responseRole: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  responseText: {
    color: '#e4e4e7',
    fontSize: 14,
    lineHeight: 22,
  },
  responsePlaceholder: {
    backgroundColor: '#050505',
    borderColor: '#18181b',
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    color: '#52525b',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#050505',
    borderColor: '#18181b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  gridLabel: {
    color: '#52525b',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 6,
  },
  gridValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
