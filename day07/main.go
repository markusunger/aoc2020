package main

import (
	"fmt"
	"io/ioutil"
	"regexp"
	"strconv"
	"strings"
)

type BagContains struct {
	name   string
	amount int
}
type PuzzleInput map[string][]BagContains

func main() {
	input := getInput()
	fmt.Println("Part 1 solution:", part1(input))
	fmt.Println("Part 2 solution:", part2(input))
}

func part1(input PuzzleInput) (result int) {
	for key := range input {
		if checkColor(key, input) {
			result++
		}
	}
	return
}

func part2(input PuzzleInput) (result int) {
	result = checkAmount("shiny gold", input)
	return
}

// recursively checks whether a bag color can contain shiny gold bag
func checkColor(color string, input PuzzleInput) bool {
	// handle dead ends (a color that does not contain any others)
	if len(input[color]) == 0 {
		return false
	}

	// check to see if the color contains a shiny gold bag
	for _, content := range input[color] {
		if content.name == "shiny gold" {
			return true
		}
		// check if the color contains other colors that contain
		// a shiny bag (recursion for the win!)
		if checkColor(content.name, input) {
			return true
		}

	}
	return false
}

// recursively checks how many bags a given color must contain
func checkAmount(color string, input PuzzleInput) int {
	sum := 0
	for _, content := range input[color] {
		sum += content.amount
		sum += content.amount * checkAmount(content.name, input)
	}
	return sum
}

// parses input file and creates a hash map with the container color
// as the key and a slice of its contents (in the form of a struct with
// a name and an amount field)
func getInput() PuzzleInput {
	content, err := ioutil.ReadFile("input")
	if err != nil {
		panic(err)
	}

	input := make(PuzzleInput)

	rules := strings.Split(string(content), "\n")
	for _, rule := range rules {
		// first, split into the container color and the content
		re := regexp.MustCompile(`^(.*) bags contain (.*)\.$`)
		result := re.FindStringSubmatch(rule)
		container := result[1]
		containsRaw := result[2]

		// split the content if there are multiple
		contains := strings.Split(containsRaw, ", ")

		var containerContent []BagContains
		for _, c := range contains {
			// for each content, split into color and amount
			re2 := regexp.MustCompile(`(\d) ([a-z]* [a-z]*) bag`)
			result2 := re2.FindStringSubmatch(c)

			// "no other bags" results in a non-match, so skip this
			if len(result2) < 3 {

				continue
			}

			amountString := result2[1]
			name := result2[2]
			amount, _ := strconv.Atoi(string(amountString))
			containerContent = append(containerContent, BagContains{name: name, amount: amount})
		}

		input[container] = containerContent
	}

	return input
}
