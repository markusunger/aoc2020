// solves https://adventofcode.com/2020/day/6
package main

import (
	"fmt"
	"io/ioutil"
	"regexp"
	"strings"
)

type GroupAnswers []string
type PuzzleInput []GroupAnswers

func main() {
	input := getInput()
	fmt.Println("Part 1 solution:", part1(input))
	fmt.Println("Part 2 solution:", part2(input))
}

func part1(input PuzzleInput) (result int) {
	for _, group := range input {
		var answers strings.Builder
		for _, person := range group {
			answers.WriteString(string(person))
		}
		uniques := unique(strings.Split(answers.String(), ""))
		result = result + len(uniques)
	}
	return
}

func part2(input PuzzleInput) (result int) {
	// this is definitely *not* an optimized solution,
	// but it runs pretty fast on my machine :P

	for _, group := range input {
		// find all unique answers from everyone in the group
		var answers strings.Builder
		for _, person := range group {
			answers.WriteString(person)
		}
		uniques := unique(strings.Split(answers.String(), ""))

		// check all unique answers for whether they appear in each person's answers
		for _, unique := range uniques {
			re := regexp.MustCompile(unique)
			if every(group, func(answers string) bool {
				return re.MatchString(answers)
			}) {
				result++
			}
		}
	}
	return
}

// from input, create a slice of slices of strings
func getInput() (input PuzzleInput) {
	content, err := ioutil.ReadFile("input")
	if err != nil {
		panic(err)
	}

	groups := strings.Split(string(content), "\n\n")

	for _, group := range groups {
		persons := make([]string, 0, len(group))
		for _, personAnswers := range strings.Split(group, "\n") {
			persons = append(persons, personAnswers)
		}
		input = append(input, persons)
	}
	return
}

// from a slice of strings, returns a subset
// of the unique values, thus eliminating any duplicates
func unique(slice []string) []string {
	result := make([]string, 0, len(slice))
	// create a hash map that holds a boolean to check
	// for each string whether it is already in the result slice
	check := make(map[string]bool)

	for _, s := range slice {
		// love those preceded statements, so we check
		// the hash map and define the condition in one line
		if _, ok := check[s]; !ok {
			result = append(result, s)
			check[s] = true
		}
	}

	return result
}

// checks if all elements in a slice of strings satisfy the condition provided by the function argument
func every(slice []string, f func(string) bool) bool {
	for _, s := range slice {
		if !f(s) {
			return false
		}
	}
	return true
}
