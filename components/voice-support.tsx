import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

interface VoiceSupportProps {
  onVoiceResult?: (text: string) => void;
  onVoiceError?: (error: string) => void;
  language?: 'english' | 'hindi';
}

export default function VoiceSupport({ 
  onVoiceResult, 
  onVoiceError, 
  language = 'english' 
}: VoiceSupportProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const startListening = () => {
    setIsListening(true);
    setIsProcessing(false);
    
    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Start rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Simulate voice recognition
    setTimeout(() => {
      stopListening();
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
    setIsProcessing(true);
    
    // Stop animations
    pulseAnim.stopAnimation();
    rotateAnim.stopAnimation();
    pulseAnim.setValue(1);
    rotateAnim.setValue(0);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      simulateVoiceResult();
    }, 1500);
  };

  const simulateVoiceResult = () => {
    const mockResults = {
      english: [
        "My name is Raj Kumar",
        "I am an electrician",
        "I have 5 years experience",
        "I live in Gurgaon",
        "My phone number is 9876543210",
      ],
      hindi: [
        "मेरा नाम राज कुमार है",
        "मैं इलेक्ट्रीशियन हूं",
        "मेरे पास 5 साल का अनुभव है",
        "मैं गुड़गांव में रहता हूं",
        "मेरा फोन नंबर 9876543210 है",
      ],
    };

    const results = mockResults[language];
    const randomResult = results[Math.floor(Math.random() * results.length)];
    
    if (onVoiceResult) {
      onVoiceResult(randomResult);
    }
  };

  const handleVoicePress = () => {
    if (isListening) {
      stopListening();
    } else if (isProcessing) {
      Alert.alert('Processing', 'Please wait while we process your voice input...');
    } else {
      startListening();
    }
  };

  const getStatusText = () => {
    if (isListening) {
      return language === 'hindi' ? 'सुन रहे हैं...' : 'Listening...';
    } else if (isProcessing) {
      return language === 'hindi' ? 'प्रोसेसिंग...' : 'Processing...';
    } else {
      return language === 'hindi' ? 'वॉइस रिकॉर्ड करें' : 'Start Voice Recording';
    }
  };

  const getStatusColor = () => {
    if (isListening) return Colors.light.warning;
    if (isProcessing) return Colors.light.info;
    return Colors.light.primary;
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.voiceButton}
        onPress={handleVoicePress}
        disabled={isProcessing}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.voiceButtonInner,
            {
              transform: [
                { scale: pulseAnim },
                { rotate: spin },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[getStatusColor(), getStatusColor() + '80']}
            style={styles.voiceButtonGradient}
          >
            <Text style={styles.voiceIcon}>
              {isListening ? '🎤' : isProcessing ? '⚡' : '🎙️'}
            </Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>

      <Text style={styles.statusText}>{getStatusText()}</Text>
      
      {isListening && (
        <View style={styles.listeningIndicator}>
          <View style={styles.wave} />
          <View style={[styles.wave, { animationDelay: '0.2s' }]} />
          <View style={[styles.wave, { animationDelay: '0.4s' }]} />
        </View>
      )}

      <View style={styles.voiceTips}>
        <Text style={styles.tipsTitle}>
          {language === 'hindi' ? 'वॉइस टिप्स:' : 'Voice Tips:'}
        </Text>
        <Text style={styles.tipText}>
          {language === 'hindi' 
            ? '• धीरे-धीरे और स्पष्ट बोलें'
            : '• Speak slowly and clearly'
          }
        </Text>
        <Text style={styles.tipText}>
          {language === 'hindi' 
            ? '• शोर-शराबे से दूर रहें'
            : '• Stay away from background noise'
          }
        </Text>
        <Text style={styles.tipText}>
          {language === 'hindi' 
            ? '• एक समय में एक वाक्य बोलें'
            : '• Speak one sentence at a time'
          }
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  voiceButton: {
    marginBottom: Spacing.md,
  },
  voiceButtonInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  voiceButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceIcon: {
    fontSize: 48,
  },
  statusText: {
    ...Typography.h4,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  wave: {
    width: 4,
    height: 20,
    backgroundColor: Colors.light.primary,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  voiceTips: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: '100%',
  },
  tipsTitle: {
    ...Typography.body,
    color: Colors.light.text,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  tipText: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
});
