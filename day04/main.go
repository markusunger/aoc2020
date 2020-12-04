// solves https://adventofcode.com/2020/day/4
package main

import (
	"fmt"
	"io/ioutil"
	"regexp"
	"strconv"
	"strings"
)

type Passport map[string]string
type PuzzleInput []Passport

// set required fields for both parts
var requiredFields = []string{"byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"}

func main() {
	input := getInput()
	fmt.Println("Part 1 solution:", part1(input))
	fmt.Println("Part 2 solution:", part2(input))
}

func part1(input *PuzzleInput) (validCount int) {
	for _, passport := range *input {
		if every(requiredFields, func(s string) bool {
			_, ok := passport[s]
			return ok
		}) {
			validCount++
		}
	}

	return
}

func part2(input *PuzzleInput) (validCount int) {
	for _, passport := range *input {
		// check for required fields and skip the validation if not all are present
		allRequired := every(requiredFields, func(s string) bool {
			_, ok := passport[s]
			return ok
		})
		if !allRequired {
			continue
		}

		allValidated := every(requiredFields, func(s string) bool {
			return validateField(s, passport[s])
		})

		if allValidated {
			validCount++
		}
	}

	return
}

// validates the value of a field depending on the given rules
func validateField(key string, value string) bool {
	switch key {
	case "byr":
		return hasLen(value, 4) && isBetween(value, 1920, 2002)
	case "iyr":
		return hasLen(value, 4) && isBetween(value, 2010, 2020)
	case "eyr":
		return hasLen(value, 4) && isBetween(value, 2020, 2030)
	case "hgt":
		heightPattern := regexp.MustCompile(`^(\d{2,3})(\w{2})$`)
		matches := heightPattern.FindStringSubmatch(value)
		if len(matches) < 1 {
			return false
		}

		if matches[2] == "cm" {
			return isBetween(matches[1], 150, 193)
		}
		if matches[2] == "in" {
			return isBetween(matches[1], 59, 76)
		}
	case "hcl":
		hairColorPattern := regexp.MustCompile(`^#[0-9a-f]{6}$`)
		return hairColorPattern.MatchString(value)
	case "ecl":
		eyeColors := map[string]bool{"amb": true, "blu": true, "brn": true, "gry": true, "grn": true, "hzl": true, "oth": true}
		return eyeColors[value]
	case "pid":
		return hasLen(value, 9)
	}

	return false
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

// checks if a string has the provided length
func hasLen(s string, l int) bool {
	return len(s) == l
}

// checks if a number (represented as a string) is between a min and max value (inclusive)
func isBetween(s string, min int, max int) bool {
	num, err := strconv.Atoi(s)
	if err != nil {
		return false
	}
	return num >= min && num <= max
}

// converts input file into a slice of hash maps
func getInput() *PuzzleInput {
	content, err := ioutil.ReadFile("input")
	if err != nil {
		panic(err)
	}

	// split into slice of raw passport data (= all lines for every passport)
	passportsRaw := strings.Split(string(content), "\n\n")
	var passports PuzzleInput

	for _, passportData := range passportsRaw {
		passport := make(Passport)

		// format passport data into neat space-separated key-value strings
		passportData := strings.ReplaceAll(passportData, "\n", " ")

		for _, keyValuePair := range strings.Split(passportData, " ") {
			// split each key-value pair into key and value and assign to hash map
			kv := strings.Split(keyValuePair, ":")
			key := kv[0]
			value := kv[1]
			passport[key] = value
		}

		passports = append(passports, passport)
	}

	return &passports
}
