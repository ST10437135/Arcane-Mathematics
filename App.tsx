import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"menu" | "game" | "leaderboard">(
    "menu"
  );
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [score, setScore] = useState<number>(0);
  const [problem, setProblem] = useState<string>("");
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);

  function generateProblem(difficulty: "easy" | "medium" | "hard") {
    let num1: number;
    let num2: number;
    let operation: string;
    let solution: number;

    switch (difficulty) {
      case "easy":
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = "+";
        solution = num1 + num2;
        break;
      case "medium":
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        operation = Math.random() > 0.5 ? "+" : "-";
        solution = operation === "+" ? num1 + num2 : num1 - num2;
        break;
      case "hard":
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        operation = Math.random() > 0.5 ? "*" : "/";
        solution = operation === "*" ? num1 * num2 : parseFloat((num1 / num2).toFixed(2));
        break;
    }

    setProblem(`${num1} ${operation} ${num2}`);
    return solution;
  }

  function startGame(selectedDifficulty: "easy" | "medium" | "hard") {
    setDifficulty(selectedDifficulty);
    setScore(0);
    setCurrentScreen("game");
    setAnswer("");
    const solution = generateProblem(selectedDifficulty);
    setCorrectAnswer(solution);
  }

  function submitAnswer() {
    if (parseFloat(answer) === correctAnswer) {
      setScore((prev) => prev + 10);
      setAnswer("");
      const newSolution = generateProblem(difficulty);
      setCorrectAnswer(newSolution);
    } else {
      alert("Incorrect! Try again.");
    }
  }

  function endGame() {
    const playerName = prompt("Enter your name:") || "Player";
    setLeaderboard((prev) =>
      [...prev, { name: playerName, score }].sort((a, b) => b.score - a.score)
    );
    setCurrentScreen("leaderboard");
  }

  function GameScreen() {
    useEffect(() => {
      if (correctAnswer === null) {
        const solution = generateProblem(difficulty);
        setCorrectAnswer(solution);
      }
    }, [correctAnswer, difficulty]);

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Difficulty: {difficulty.toUpperCase()}</Text>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.problemText}>{problem}</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Answer"
          keyboardType="numeric"
          value={answer}
          onChangeText={setAnswer}
        />
        <TouchableHighlight style={styles.button} onPress={submitAnswer}>
          <Text style={styles.buttonText}>Submit Answer</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={endGame}>
          <Text style={styles.buttonText}>End Game</Text>
        </TouchableHighlight>
      </View>
    );
  }

  function LeaderboardScreen() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Leaderboard</Text>
        <FlatList
          data={leaderboard}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.listItem}>
              {item.name}: {item.score} points
            </Text>
          )}
        />
        <TouchableHighlight
          style={styles.button}
          onPress={() => setCurrentScreen("menu")}
        >
          <Text style={styles.buttonText}>Return to Menu</Text>
        </TouchableHighlight>
      </View>
    );
  }

  function MenuScreen() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Arcane Mathematics</Text>
        <Text style={styles.subtitle}>Select a Difficulty to Start</Text>
        <TouchableHighlight
          style={styles.button}
          onPress={() => startGame("easy")}
        >
          <Text style={styles.buttonText}>Easy</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={() => startGame("medium")}
        >
          <Text style={styles.buttonText}>Medium</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={() => startGame("hard")}
        >
          <Text style={styles.buttonText}>Hard</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={() => setCurrentScreen("leaderboard")}
        >
          <Text style={styles.buttonText}>Leaderboard</Text>
        </TouchableHighlight>
      </View>
    );
  }

  return (
    <>
      {currentScreen === "menu" && <MenuScreen />}
      {currentScreen === "game" && <GameScreen />}
      {currentScreen === "leaderboard" && <LeaderboardScreen />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#4B0082", 
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#E6E6FA", 
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 16,
    color: "#D8BFD8", 
  },
  button: {
    backgroundColor: "#6A0DAD", 
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF", 
    fontSize: 16,
  },
  score: {
    fontSize: 20,
    marginBottom: 16,
    color: "#BA55D3", 
  },
  problemText: {
    fontSize: 22,
    marginBottom: 16,
    color: "#DA70D6", 
  },
  input: {
    width: "80%",
    borderColor: "#DDA0DD", 
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    fontSize: 18,
    backgroundColor: "#F8F8FF", 
    textAlign: "center",
  },
  listItem: {
    fontSize: 18,
    padding: 8,
    color: "#E6E6FA", 
  },
});
