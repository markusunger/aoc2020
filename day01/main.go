package main

import (
	"fmt"
	"io/ioutil"
	"sort"
	"strconv"
	"strings"
)

const Target = 2020

type PuzzleInput []int

// helper function to read input file and convert to slice of ints
func getInput() PuzzleInput {
	content, err := ioutil.ReadFile("input")
	if err != nil {
		panic(err)
	}

	strings := strings.Split(string(content), "\n")
	var nums PuzzleInput

	for _, string := range strings {
		num, _ := strconv.Atoi(string)
		nums = append(nums, num)
	}

	return nums
}

func part1(values PuzzleInput) int {
	sort.Ints(values)

	solution := 0
	leftPointer := 0
	rightPointer := len(values) - 1

	for solution == 0 {
		current := values[leftPointer] + values[rightPointer]

		if current == Target {
			solution = values[leftPointer] * values[rightPointer]
			break
		}

		if current < Target {
			leftPointer++
		}

		if current > Target {
			rightPointer--
		}
	}

	return solution
}

func part2(values PuzzleInput) (solution int) {
	// brute force because I'm out of ideas and time :P
	solution = 0
	for i, num1 := range values {
		for j, num2 := range values[i+1:] {
			for _, num3 := range values[j+1:] {
				if num1+num2+num3 == Target {
					solution = num1 * num2 * num3
					return
				}
			}
		}
	}
	return
}

func main() {
	values := getInput()
	fmt.Println("Part 1 solution", part1(values))
	fmt.Println("Part 2 solution", part2(values))
}
