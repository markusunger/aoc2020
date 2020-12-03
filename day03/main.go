// solves https://adventofcode.com/2020/day/3
package main

import (
	"fmt"
	"io/ioutil"
	"strings"
)

type PuzzleInput *[]string

type Move struct {
	right int
	down  int
}

// returns a pointer to a slice of strings (= rows in the grid)
func getInput() PuzzleInput {
	content, _ := ioutil.ReadFile("input")
	rows := strings.Split(string(content), "\n")
	return &rows
}

// takes a move struct and the grid pointer and rides the toboggan to see how many trees were hit \o/
func ride(input PuzzleInput, move Move) (treeCount int) {
	row := 0
	col := 0
	maxCol := len((*input)[0])

	for row < len(*input) {
		row = row + move.down
		// break early if beyond the last row
		if row >= len(*input) {
			break
		}

		col = col + move.right
		// start from the left again if going out of bounds in the horizontal direction
		if col >= maxCol {
			col = col - maxCol
		}

		if string((*input)[row][col]) == "#" {
			treeCount++
		}
	}

	return
}

func part1(input PuzzleInput) int {
	move := Move{right: 3, down: 1}

	return ride(input, move)
}

func part2(input PuzzleInput) int {
	moves := []Move{
		Move{right: 1, down: 1},
		Move{right: 3, down: 1},
		Move{right: 5, down: 1},
		Move{right: 7, down: 1},
		Move{right: 1, down: 2},
	}
	treeCounts := make([]int, 0)

	for _, move := range moves {
		treeCounts = append(treeCounts, ride(input, move))
	}

	result := treeCounts[0]
	for _, treeCount := range treeCounts[1:] {
		result = result * treeCount
	}
	return result
}

func main() {
	input := getInput()
	fmt.Println("Part 1 solution:", part1(input))
	fmt.Println("Part 2 solution:", part2(input))
}
