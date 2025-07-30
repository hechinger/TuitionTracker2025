"use client";

import React from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
}

type ErrorBoundaryState = {
  hasError: boolean;
}

/**
 * This is a utility component to catch errors thrown while rendering
 * its children.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error("Error caught by Error Boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
