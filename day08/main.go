// solves https://adventofcode.com/2020/day/8
package main

import (
	"fmt"
	"io/ioutil"
	"strconv"
	"strings"
)

type PuzzleInput []*Instruction
type Instruction struct {
	command  string
	value    int
	executed bool
}

func main() {
	input := getInput()
	_, solutionPart1 := part1(input)
	fmt.Println("Part 1 solution:", solutionPart1)
}

func part1(input PuzzleInput) (bool, int) {
	acc := 0
	pointer := 0

	for {
		run := input[pointer]

		if pointer > len(input) {
			return true, acc
		}

		if run.executed {
			return false, acc
		}

		switch run.command {
		case "acc":
			acc += run.value
			pointer++
		case "nop":
			pointer++
		case "jmp":
			pointer += run.value
		}

		run.executed = true
	}
}

// parse the input file and create a slice of pointers to instructions
func getInput() PuzzleInput {
	content, err := ioutil.ReadFile("input")
	if err != nil {
		panic(err)
	}
	input := make([]*Instruction, 0, len(content))

	for _, line := range strings.Split(string(content), "\n") {
		parts := strings.Split(line, " ")
		valueInt, _ := strconv.Atoi(parts[1])
		newInstruction := Instruction{
			command:  parts[0],
			value:    valueInt,
			executed: false,
		}
		input = append(input, &newInstruction)
	}
	return input
}
