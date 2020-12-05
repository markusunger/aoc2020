// solves https://adventofcode.com/2020/day/5
package main

import (
	"fmt"
	"io/ioutil"
	"sort"
	"strings"
)

type PuzzleInput *[]BoardingPass
type BoardingPass struct {
	row    []string
	column []string
}

const maxRow int = 127
const maxColumn int = 7

func main() {
	input := getInput()
	fmt.Println("Part 1 solution:", part1(input))
	fmt.Println("Part 2 solution:", part2(input))
}

func part1(input PuzzleInput) (highestSeatID int) {
	var seatIds []int
	for _, pass := range *input {
		row := bsp(pass.row, 0, maxRow)
		column := bsp(pass.column, 0, maxColumn)
		seatIds = append(seatIds, row*8+column)
	}
	return highest(seatIds)
}

func part2(input PuzzleInput) int {
	var seatIds []int
	for _, pass := range *input {
		seatIds = append(seatIds, bsp(pass.row, 0, maxRow)*8+bsp(pass.column, 0, maxColumn))
	}
	sort.Slice(seatIds, func(a, b int) bool {
		return seatIds[a] < seatIds[b]
	})
	idLen := len(seatIds)
	for idx, id := range seatIds {
		if idx+1 < idLen && seatIds[idx+1] != id+1 {
			return id + 1
		}
	}

	// should not happen
	return 0
}

// recursively applies binary space partitioning for the input slice of strings
func bsp(slice []string, min int, max int) int {
	// base case
	if len(slice) == 1 {
		if slice[0] == "F" || slice[0] == "L" {
			return min
		}
		return max
	}

	letter := slice[0]
	if letter == "B" || letter == "R" {
		return bsp(slice[1:], (min+max)/2+1, max)
	}
	return bsp(slice[1:], min, (min+max)/2)
}

// finds the highest element in a slice of ints
func highest(slice []int) (h int) {
	for _, num := range slice {
		if num > h {
			h = num
		}
	}
	return
}

// from the input file, extract a slice of structs separated into row and column slices of strings
func getInput() PuzzleInput {
	content, err := ioutil.ReadFile("input")
	if err != nil {
		panic(err)
	}
	passLines := strings.Split(string(content), "\n")
	var passes []BoardingPass
	for _, pass := range passLines {
		passSlice := strings.Split(pass, "")
		passes = append(passes, BoardingPass{row: passSlice[:7], column: passSlice[7:]})

	}
	return &passes
}
