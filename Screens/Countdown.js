'use client'

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Vibration,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

function generateParticles(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    dx: (Math.random() - 0.5) * 2,
    dy: (Math.random() - 0.5) * 2,
    size: Math.random() * 3 + 2, // Size between 2 and 5
  }));
}

function getMinutesLeftInDay() {
  const now = new Date();
  return 1440 - (now.getHours() * 60 + now.getMinutes());
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isNewYear, setIsNewYear] = useState(false);
  const [particles, setParticles] = useState([]);
  const [particleCount, setParticleCount] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const lastUpdateDay = useRef(new Date().getDate());
  let longPressTimer;
  let vibrationTimer;

  function calculateTimeLeft() {
    const now = new Date();
    const target = new Date(now.getFullYear() + 1, 0, 1); // Next year's January 1st
    const difference = target - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        months: target.getMonth() - now.getMonth() + 12 * (target.getFullYear() - now.getFullYear()),
        days: Math.floor((difference / (1000 * 60 * 60 * 24)) % 30),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      const now = new Date();
      if (now.getDate() !== lastUpdateDay.current) {
        lastUpdateDay.current = now.getDate();
        const newParticles = generateParticles(getMinutesLeftInDay());
        setParticles(newParticles);
        setParticleCount(newParticles.length);
      }

      if (Object.keys(newTimeLeft).length === 0) {
        setIsNewYear(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const initialParticles = generateParticles(getMinutesLeftInDay());
    setParticles(initialParticles);
    setParticleCount(initialParticles.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((p) => {
          let newX = p.x + p.dx;
          let newY = p.y + p.dy;
          let newDx = p.dx;
          let newDy = p.dy;

          if (newX <= 0 || newX >= width) newDx = -newDx;
          if (newY <= 0 || newY >= height) newDy = -newDy;

          return {
            ...p,
            x: Math.max(0, Math.min(newX, width)),
            y: Math.max(0, Math.min(newY, height)),
            dx: newDx,
            dy: newDy,
          };
        })
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  const handlePressIn = () => {
    vibrationTimer = setTimeout(() => {
      Vibration.vibrate([300]); // Vibrate in a pattern
    }, 2000);

    longPressTimer = setTimeout(() => {
      Vibration.cancel(); // Stop vibration before navigation
      navigation.navigate('Post');
    }, 5000);
  };

  const handlePressOut = () => {
    clearTimeout(longPressTimer);
    clearTimeout(vibrationTimer);
    Vibration.cancel(); // Stop vibration if the user releases early
  };

  const timerComponents = Object.entries(timeLeft)
    .map(([interval, value]) => {
      if (!value) {
        return null;
      }

      const suffix = {
        months: 'mo',
        days: 'd',
        hours: 'h',
        minutes: 'm',
        seconds: 's',
      }[interval];

      return `${value}${suffix}`;
    })
    .filter(Boolean)
    .join(' ');

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <View style={styles.container}>
        {particles.map((particle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
              },
            ]}
          />
        ))}

        {isNewYear ? (
          <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>Happy New Year!</Animated.Text>
        ) : (
          <Text style={styles.text}>{timerComponents}</Text>
        )}

        <Text style={styles.particleCountText} accessibilityLabel={`Number of particles: ${particleCount}`}>
          Particles: {particleCount}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 0,
    opacity: 0.5
  },
  particleCountText: {
    position: 'absolute',
    bottom: 20,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

