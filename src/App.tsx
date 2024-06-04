import { useCallback, useEffect, useState } from "react"
import words from "./wordList.json"
import { Drawing } from "./Drawing"
import { Word } from "./Word"
import { Keyboard } from "./Keyboard"

function getWord() {
  return words[Math.floor(Math.random() * words.length)]
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)]
  })

  const [guessedLetters, setGuessedLetters] = useState<string[]>([])

  const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter))

  const isLoser = incorrectLetters.length >= 6
  const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter))

// first input is the function you want to run
// second input is the dependency, which means the function only reruns
// if this dependency has any changes
  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isLoser || isWinner) return

    setGuessedLetters(currentLetters => [...currentLetters, letter])
  }, [guessedLetters, isLoser, isWinner])


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      // check if an alphabetical letter was pressed
      if (!key.match(/^[a-z]$/)) return

      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener("keypress", handler)
    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      // check if an alphabetical letter was pressed
      if (key !== "Enter") return

      e.preventDefault()
      setGuessedLetters([])
      setWordToGuess(getWord())
    }

    document.addEventListener("keypress", handler)
    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [])



  return (
    <div style={{
      maxWidth: "800px",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      margin: "0 auto",
      alignItems: "center"
    }}>
      <div style={{
        fontSize: "2rem",
        textAlign: "center"
      }}>
        {isWinner && "Winner! - Refresh to try again"}
        {isLoser && "Refresh to try again"}
        </div>
        <Drawing numberOfGuesses={incorrectLetters.length}/>
        <Word
          guessedLetters={guessedLetters}
          wordToGuess={wordToGuess}
          reveal = {isLoser}
        />
        <div style={{ alignSelf: "stretch" }}>
          <Keyboard
            disabled = {isWinner || isLoser}
            activeLetters={guessedLetters.filter(letter =>
              wordToGuess.includes(letter)
            )}
            inactiveLetters={incorrectLetters}
            addGuessedLetters = {addGuessedLetter}
          />
      </div>
    </div>
  )
}

export default App
