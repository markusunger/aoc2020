package main

import (
	"fmt"
	"io/ioutil"
	"strconv"
	"strings"
)

type PasswordAndPolicy struct {
	lowerBound int
	upperBound int
	letter     string
	password   string
}

type PuzzleInput *[]PasswordAndPolicy

// split input into slice of appropriate structs and return a pointer to it
func getInput() PuzzleInput {
	content, err := ioutil.ReadFile("input")
	if err != nil {
		panic(err)
	}

	var inputs []PasswordAndPolicy

	lines := strings.Split(string(content), "\n")
	for _, line := range lines {
		x := strings.Split(line, ": ")
		password := x[1]
		y := strings.Split(x[0], " ")
		letter := y[1]
		z := strings.Split(y[0], "-")
		lowerBound, _ := strconv.Atoi(z[0])
		upperBound, _ := strconv.Atoi(z[1])

		inputs = append(inputs, PasswordAndPolicy{lowerBound: lowerBound, upperBound: upperBound, letter: letter, password: password})
	}

	return &inputs
}

func part1(input PuzzleInput) int {
	validCount := 0
	for _, item := range *input {
		letterCount := strings.Count(item.password, item.letter)
		if letterCount >= item.lowerBound && letterCount <= item.upperBound {
			validCount++
		}
	}

	return validCount
}

func main() {
	input := getInput()
	fmt.Println("Part 1 solution", part1(input))
	// fmt.Println("Part 2 solution", part2(input))
}
