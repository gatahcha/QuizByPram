# Quiz Generation Prompt

## Instructions
Please create a quiz in JSON format based on the provided material. Follow the structure and guidelines below carefully.

## JSON Structure
```json
{
  "title": "Quiz Title Here",
  "description": "Brief description of what this quiz covers",
  "questions": [
    {
      "question": "Question text here?",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why this is the correct answer and why other options are incorrect."
    }
  ]
}
```

## Field Requirements

### Title
- Should be clear and descriptive
- Include the subject/topic and chapter/section if applicable
- Example: "FNH 200 - Chapter 2: Nutrition Basics"

### Description
- Provide a brief overview of what the quiz covers
- Mention the key topics or concepts included
- Keep it concise (1-2 sentences)

### Questions
Each question should have:

#### Question Text
- Clear, unambiguous wording
- End with a question mark if it's a question
- Avoid double negatives or confusing phrasing
- Be specific and test understanding, not just memorization

#### Options (Answer Choices)
**CRITICAL: Make answer options similar to create productive difficulty for students.**

This is essential for effective learning:
- ✅ **DO:** Create plausible distractors that sound similar or test subtle distinctions
- ✅ **DO:** Use options that require careful thinking to differentiate
- ✅ **DO:** Include common misconceptions as incorrect options
- ✅ **DO:** Make all options similar in length and complexity
- ✅ **DO:** Use similar terminology or phrasing across options
- ❌ **DON'T:** Make one option obviously different or silly
- ❌ **DON'T:** Use joke answers or clearly wrong options
- ❌ **DON'T:** Make the correct answer stand out by being much longer or more detailed

**Examples of Good vs. Bad Options:**

❌ **Bad (Too Easy):**
```
Question: "What is the primary function of mitochondria?"
Options:
- "Energy production"
- "Making pizza"
- "Flying"
- "Singing songs"
```

✅ **Good (Creates Productive Confusion):**
```
Question: "What is the primary function of mitochondria?"
Options:
- "Energy production through ATP synthesis"
- "Protein synthesis and folding"
- "Lipid metabolism and storage"
- "DNA replication and repair"
```

**Additional Examples:**

✅ **Good - Similar Numerical Values:**
```
Question: "How many calories does 1 gram of protein provide?"
Options:
- "2 calories"
- "4 calories"
- "7 calories"
- "9 calories"
```

✅ **Good - Similar Concepts:**
```
Question: "Which vitamin is produced by the body when exposed to sunlight?"
Options:
- "Vitamin A"
- "Vitamin C"
- "Vitamin D"
- "Vitamin E"
```

#### Correct Answer
- Use **zero-based indexing** (0 = first option, 1 = second option, etc.)
- Double-check that the index matches the correct option
- Vary the position of correct answers (don't always make it option 0 or 1)

#### Explanation
- Provide a comprehensive explanation of the correct answer
- Explain WHY it's correct
- Optionally explain why the other options are incorrect
- Include additional context or related information when helpful
- 2-4 sentences is typically appropriate

## Question Quality Guidelines

### Difficulty Levels
- Mix question difficulties: 30% easy, 50% medium, 20% hard
- Easy: Basic recall and simple understanding
- Medium: Application and analysis
- Hard: Synthesis and evaluation

### Question Types to Include
- **Definitional:** "What is X?"
- **Conceptual:** "Which of the following best describes X?"
- **Application:** "In scenario Y, what would happen?"
- **Comparison:** "What is the difference between X and Y?"
- **Analytical:** "Why does X occur?"

### Common Pitfalls to Avoid
- ❌ Don't use "All of the above" or "None of the above" unless necessary
- ❌ Don't include absolute words like "always" or "never" unless they're truly accurate
- ❌ Don't make the correct answer obviously longer or more detailed
- ❌ Don't use overlapping options that could both be correct
- ❌ Don't test trivial details that aren't important to understand

## Quiz Size
- Aim for **10-15 questions** for a comprehensive quiz
- Minimum **5 questions** for shorter quizzes
- Can create longer quizzes (20+) for extensive material coverage

## Quality Checklist
Before finalizing, verify:
- [ ] Valid JSON syntax (no trailing commas, proper quotes)
- [ ] All questions have exactly 4 options
- [ ] All `correctAnswer` values are valid indices (0-3)
- [ ] Answer options are similar and create productive difficulty
- [ ] No obviously wrong or joke answers
- [ ] Explanations are clear and informative
- [ ] Questions are well-distributed across the material
- [ ] Correct answers are distributed across all option positions
- [ ] No typos or grammatical errors

## Example Complete Question

```json
{
  "question": "What is the difference between complete and incomplete proteins?",
  "options": [
    "Complete proteins are plant-based, incomplete are animal-based",
    "Complete proteins contain all essential amino acids, incomplete proteins lack one or more",
    "Complete proteins have more calories than incomplete proteins",
    "Complete proteins are synthesized faster than incomplete proteins"
  ],
  "correctAnswer": 1,
  "explanation": "Complete proteins contain all nine essential amino acids in adequate amounts. Animal sources (meat, eggs, dairy) are typically complete proteins. Incomplete proteins lack one or more essential amino acids and are usually plant-based, though combining different plant proteins can provide all essential amino acids."
}
```

Note how all four options:
- Sound plausible and academic
- Use similar structure ("Complete proteins... incomplete...")
- Are similar in length
- Test understanding rather than making one option obviously silly
- Create confusion that requires actual knowledge to resolve

## How to Use This Prompt

1. Copy this entire prompt
2. Attach your quiz material (textbook chapter, notes, study guide, etc.)
3. Submit both to your AI assistant
4. Request: "Using the quiz-prompt.md guidelines, create a quiz based on the attached material"
5. Review the generated quiz and save it as a `.json` file in the `quizzes/` directory

## Tips for Best Results
- Provide well-organized source material
- Highlight key concepts you want tested
- Specify any particular areas of focus
- Mention if you want certain question types emphasized
- Request revisions if options aren't similar enough

---

**Remember:** The goal is to create quizzes that genuinely test understanding through thoughtful, similar options that require students to carefully distinguish between concepts, not quizzes where answers are obvious or silly.

