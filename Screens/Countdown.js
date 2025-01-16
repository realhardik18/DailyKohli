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

function getMinutesLeftInHour() {
  const now = new Date();
  return 60 - now.getMinutes();
}

function generateParticles(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    dx: (Math.random() - 0.5) * 1,
    dy: (Math.random() - 0.5) * 1,
    size: Math.random() * 3 + 2,
    opacity: new Animated.Value(0), // Initialize opacity for animation
  }));
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isNewYear, setIsNewYear] = useState(false);
  const [particles, setParticles] = useState([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const lastUpdateHour = useRef(new Date().getHours());
  let longPressTimer;
  let vibrationTimer;

  function calculateTimeLeft() {
    const now = new Date();
    const target = new Date(now.getFullYear() + 1, 0, 1);
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
      // Update particles when the hour changes
      if (now.getHours() !== lastUpdateHour.current) {
        lastUpdateHour.current = now.getHours();
        const newParticles = generateParticles(getMinutesLeftInHour());
        setParticles(newParticles);

        // Animate new particles
        newParticles.forEach((particle) => {
          Animated.timing(particle.opacity, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        });
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
    const initialParticles = generateParticles(getMinutesLeftInHour());
    setParticles(initialParticles);

    // Animate initial particles
    initialParticles.forEach((particle) => {
      Animated.timing(particle.opacity, {
        toValue: 0.5,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((p) => {
          let newX = p.x + p.dx;
          let newY = p.y + p.dy;
          let newDx = p.dx;
          let newDy = p.dy;

          if (newX <= 0 || newX >= width) {
            newDx = -newDx * 0.98;
            newX = newX <= 0 ? 0 : width;
          }
          if (newY <= 0 || newY >= height) {
            newDy = -newDy * 0.98;
            newY = newY <= 0 ? 0 : height;
          }

          return {
            ...p,
            x: newX,
            y: newY,
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
      Vibration.vibrate([300]);
    }, 2000);

    longPressTimer = setTimeout(() => {
      Vibration.cancel();
      navigation.navigate('Post');
    }, 5000);
  };

  const handlePressOut = () => {
    clearTimeout(longPressTimer);
    clearTimeout(vibrationTimer);
    Vibration.cancel();
  };

  const timerComponents = Object.entries(timeLeft)
    .map(([interval, value]) => {
      // Ensure seconds are always displayed, even when 0
      if (interval === 'seconds' || value) {
        const suffix = {
          months: 'mo',
          days: 'd',
          hours: 'h',
          minutes: 'm',
          seconds: 's',
        }[interval];

        // Add leading zero for single-digit values, including 0
        value = value < 10 ? `0${value}` : value;

        return `${value}${suffix}`;
      }
      return null;
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
                opacity: particle.opacity, // Use animated opacity
              },
            ]}
          />
        ))}
        
        <View style={styles.bottomContainer}>
          {isNewYear ? (
            <Animated.Text style={[styles.countdownText, { opacity: fadeAnim }]}>
              Happy New Year!
            </Animated.Text>
          ) : (
            <>
              <Text style={styles.countdownText}>{timerComponents}</Text>
              <Text style={styles.particleCountText}>
                Minutes left this hour: {getMinutesLeftInHour()}
              </Text>
            </>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  countdownText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center', // Center-align text
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 0,
  },
  particleCountText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Center-align text
  },
});