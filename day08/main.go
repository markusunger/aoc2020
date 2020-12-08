// solves https://adventofcode.com/2020/day/8
package main

import (
	"fmt"
	"io/ioutil"
	"strconv"
	"strings"
)

type PuzzleInput []Instruction
type Instruction struct {
	command string
	value   int
}

func main() {
	input := getInput()
	_, solutionPart1 := part1(input)
	fmt.Println("Part 1 solution:", solutionPart1)
	fmt.Println("Part 2 solution:", part2(input))
}

func part1(input PuzzleInput) (bool, int) {
	acc := 0
	pointer := 0
	seen := make([]int, 0)

	for {
		if pointer >= len(input) {
			return true, acc
		}

		if contains(seen, pointer) {
			return false, acc
		}

		seen = append(seen, pointer)
		run := input[pointer]

		switch run.command {
		case "acc":
			acc += run.value
			pointer++
		case "nop":
			pointer++
		case "jmp":
			pointer += run.value
		}

	}
}

func part2(input PuzzleInput) int {
	inputs := make([]PuzzleInput, 0)

	for i := 0; i < len(input); i++ {
		inst := input[i]
		if inst.command != "jmp" && inst.command != "nop" {
			continue
		}

		newInst := inst
		if newInst.command == "jmp" {
			newInst.command = "nop"
		} else {
			newInst.command = "jmp"
		}

		newInput := make([]Instruction, len(input))
		copy(newInput, input)
		newInput[i] = newInst
		inputs = append(inputs, newInput)
	}

	for _, input := range inputs {
		terminated, finalAcc := part1(input)
		if terminated {
			return finalAcc
		}
	}
	return 0
}

// checks whether a slice of ints contains a specific int
func contains(s []int, v int) bool {
	for _, num := range s {
		if num == v {
			return true
		}
	}
	return false
}

// parse the input file and create a slice of instructions
func getInput() PuzzleInput {
	content, err := ioutil.ReadFile("input")
	if err != nil {
		panic(err)
	}
	input := make([]Instruction, 0, len(content))

	for _, line := range strings.Split(string(content), "\n") {
		parts := strings.Split(line, " ")
		valueInt, _ := strconv.Atoi(parts[1])
		newInstruction := Instruction{
			command: parts[0],
			value:   valueInt,
		}
		input = append(input, newInstruction)
	}
	return input
}
