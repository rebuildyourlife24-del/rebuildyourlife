import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-react-native';
// Note: We use basic RN components here as placeholders for Expo.

export default function RedBlackBoxMobile() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.superTitle}>ORION CORE</Text>
          <Text style={styles.title}>Red Black Box</Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>SECURE</Text>
        </View>
      </View>

      {/* Main KPI */}
      <View style={styles.kpiCard}>
        <Text style={styles.kpiLabel}>REAL-TIME REVENUE (24H)</Text>
        <Text style={styles.kpiValue}>€ 14.280,00</Text>
        <Text style={styles.kpiSub}>+12.4% vs Yesterday</Text>
      </View>

      {/* Swarm Intelligence Alert */}
      <View style={styles.alertCard}>
        <Text style={styles.alertTitle}>SWARM INTELLIGENCE</Text>
        <Text style={styles.alertText}>
          Agent 1 & 2 have drafted a new TikTok campaign. Financial Agent approved €500 budget.
        </Text>
        <TouchableOpacity style={styles.alertButton}>
          <Text style={styles.alertButtonText}>REVIEW & LAUNCH</Text>
        </TouchableOpacity>
      </View>

      {/* Grid Stats */}
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>ACTIVE ADS</Text>
          <Text style={styles.gridValue}>24</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>GLOBAL ROAS</Text>
          <Text style={styles.gridValue}>4.2x</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>DEVOPS (HANDYMAN)</Text>
          <Text style={[styles.gridValue, {color: '#10b981'}]}>ONLINE</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>AI VOICE (VIN DIESEL)</Text>
          <Text style={[styles.gridValue, {color: '#3b82f6'}]}>READY</Text>
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
    marginBottom: 30,
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
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  statusText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: 'bold',
  },
  kpiCard: {
    backgroundColor: '#0a0a0a',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  kpiLabel: {
    color: '#52525b',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  kpiValue: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  kpiSub: {
    color: '#10b981',
    fontSize: 12,
    marginTop: 8,
  },
  alertCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  alertTitle: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  alertText: {
    color: '#d4d4d8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  alertButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  alertButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#0a0a0a',
    borderColor: '#27272a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  gridLabel: {
    color: '#52525b',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  gridValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
