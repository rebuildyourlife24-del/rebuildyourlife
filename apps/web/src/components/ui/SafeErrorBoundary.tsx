"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  errorInfo: string;
}

export class SafeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorInfo: ""
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorInfo: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Sci-Fi Engine Component Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-red-950/20 border border-red-900/50 rounded-lg backdrop-blur-md">
          <AlertTriangle className="w-8 h-8 text-red-500 mb-2 animate-pulse" />
          <h3 className="text-red-400 font-bold tracking-widest uppercase text-sm mb-1">
            Component Failure
          </h3>
          <p className="text-red-500/70 text-xs font-mono text-center max-w-md">
            {this.props.fallbackMessage || "Deze grafiek kon niet worden gerenderd vanwege corrupte data."}
          </p>
          <div className="mt-4 text-[10px] text-red-900 font-mono bg-black/50 p-2 rounded w-full overflow-hidden">
             {this.state.errorInfo}
          </div>
          <button 
            className="mt-4 px-4 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs uppercase tracking-widest rounded border border-red-800 transition-colors"
            onClick={() => this.setState({ hasError: false })}
          >
            Retry Render
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
