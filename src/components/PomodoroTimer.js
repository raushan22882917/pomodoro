'use client';

import { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaRedo, FaCog } from 'react-icons/fa'; 
import styles from '../styles/PomodoroTimer.module.css';

const PomodoroTimer = () => {
  const defaultPomodoro = 25; 
  const defaultBreak = 5; 

  const [pomodoroTimes, setPomodoroTimes] = useState([defaultPomodoro, defaultPomodoro, defaultPomodoro]); 
  const [breakTimes, setBreakTimes] = useState([defaultBreak, defaultBreak, defaultBreak]);
  const [sequenceIndex, setSequenceIndex] = useState(0); 
  const [timeLeft, setTimeLeft] = useState(pomodoroTimes[0] * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false); 

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerEnd();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleTimerEnd = () => {
    const audio = new Audio('/alarm.wav');
    audio.play();

    if (sequenceIndex % 2 === 0) {
      setSequenceIndex((prev) => prev + 1);
      setTimeLeft(breakTimes[sequenceIndex / 2] * 60); 
    } else {
      if (sequenceIndex < pomodoroTimes.length * 2 - 2) {
        setSequenceIndex((prev) => prev + 1);
        setTimeLeft(pomodoroTimes[(sequenceIndex + 1) / 2] * 60); 
      } else {
        setSequenceIndex(0);
        setTimeLeft(pomodoroTimes[0] * 60); 
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleSettingsSave = (newPomodoroTimes, newBreakTimes) => {
    setPomodoroTimes(newPomodoroTimes);
    setBreakTimes(newBreakTimes);
    setSequenceIndex(0);
    setTimeLeft(newPomodoroTimes[0] * 60); 
    setShowSettings(false); 
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings); 
  };

  return (
    <div className={styles.pomodoroContainer}>
      <h1 className={styles.title}>POMODORO</h1>

      {/* Settings icon */}
      <div className={styles.settingsIcon}>
        <FaCog onClick={toggleSettings} /> {/* Click to toggle settings box */}
      </div>

      {/* Timer display */}
      <div className={styles.cycleContainer}>
        {sequenceIndex % 2 === 0 ? (
          <PomodoroCycle
            sessionLength={pomodoroTimes[sequenceIndex / 2]}
            timeLeft={timeLeft}
            formatTime={formatTime}
            imageSrc="/pomodoro.png"
          />
        ) : (
          <ActivityIcon
            activityTime={breakTimes[(sequenceIndex - 1) / 2]}
            timeLeft={timeLeft}
            formatTime={formatTime}
            imageSrc="/water.jpeg"
          />
        )}
      </div>

      {/* Timer control buttons */}
      <div className={styles.buttons}>
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? <FaPause /> : <FaPlay />} {/* Play/Pause Icon */}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setSequenceIndex(0); 
            setTimeLeft(pomodoroTimes[0] * 60);
          }}
        >
          <FaRedo /> {/* Reset Icon */}
          Reset
        </button>
      </div>

      {/* Settings box - only shows when clicked */}
      {showSettings && (
        <div className={styles.settingsBox}>
          <SettingsModal
            onSave={handleSettingsSave}
            defaultPomodoro={defaultPomodoro}
            defaultBreak={defaultBreak}
          />
        </div>
      )}
    </div>
  );
};

const PomodoroCycle = ({ sessionLength, timeLeft, formatTime, imageSrc }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / (sessionLength * 60)) * circumference;

  return (
    <div className={styles.pomodoroCycle}>
      <svg width="200" height="200" className={styles.circle}>
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="green"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
        <image href={imageSrc} x="0" y="0" width="200" height="200" />
        <text
          x="100"
          y="100"
          textAnchor="middle"
          dominantBaseline="middle"
          className={styles.timerText}
        >
          {formatTime(timeLeft)}
        </text>
      </svg>
    </div>
  );
};

const ActivityIcon = ({ activityTime, timeLeft, formatTime, imageSrc }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / (activityTime * 60)) * circumference;

  return (
    <div className={styles.activityCycle}>
      <svg width="200" height="200" className={styles.circle}>
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="blue"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
        <image href={imageSrc} x="0" y="0" width="200" height="200" />
        <text
          x="100"
          y="100"
          textAnchor="middle"
          dominantBaseline="middle"
          className={styles.timerText}
        >
          {formatTime(timeLeft)}
        </text>
      </svg>
    </div>
  );
};

const SettingsModal = ({ onSave, defaultPomodoro, defaultBreak }) => {
  const initialPomodoroTimes = new Array(3).fill(defaultPomodoro); 
  const initialBreakTimes = new Array(3).fill(defaultBreak); 
  
  const [newPomodoroTimes, setNewPomodoroTimes] = useState(initialPomodoroTimes);
  const [newBreakTimes, setNewBreakTimes] = useState(initialBreakTimes);

  const handleSave = () => {
    onSave(newPomodoroTimes, newBreakTimes);
  };

  return (
<div className={styles.settingsModal}>
  <h2>Update Pomodoro and Break Times</h2>

  {/* Container for Pomodoro and Break columns */}
  <div className={styles.pomodoroBreakContainer}>
    {/* Labels for the columns */}
    <div className={styles.columnHeader}>
      <span>Pomodoro</span>
      <span>Break</span>
    </div>

    {/* Row for Pomodoro and Break inputs */}
    {newPomodoroTimes.map((time, index) => (
      <div key={`session-${index}`} className={styles.inputRow}>
        {/* Pomodoro input */}
        <div className={styles.inputField}>
          <label>Pomodoro {index + 1}:</label>
          <input
            type="number"
            value={time}
            onChange={(e) => {
              const updatedTimes = [...newPomodoroTimes];
              updatedTimes[index] = Math.max(1, parseInt(e.target.value, 10)) || defaultPomodoro;
              setNewPomodoroTimes(updatedTimes);
            }}
          />
        </div>

        {/* Break input */}
        <div className={styles.inputField}>
          <label>Break {index + 1}:</label>
          <input
            type="number"
            value={newBreakTimes[index]}
            onChange={(e) => {
              const updatedBreakTimes = [...newBreakTimes];
              updatedBreakTimes[index] = Math.max(1, parseInt(e.target.value, 10)) || defaultBreak;
              setNewBreakTimes(updatedBreakTimes);
            }}
          />
        </div>
      </div>
    ))}
  </div>

  <button onClick={handleSave}>Save</button>
</div>

  );
};

export default PomodoroTimer;
