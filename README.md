# Campsite
Campsite is a `jest` runner that helps you focus on improving test coverage.

## The Pitch
Have you ever heard of a Boy Scout Rule that says

```
   "Try and leave this world a little better than you found it."
```

You can also apply this rule in software development as well. Here is another quote from Uncle Bob:

```
   "Always leave the code you're editing a little better than you found it."
```

Then you might ask question, *__How do I know when I am editing the code if I have made it better or worse?__*


```
   Have we made our test coverage better or have we made it worse than before?
```

__Campsite__ can show you exactly that. It compares your unit test coverage against a baseline (*"code when you found it"*). It then gives you a concise report of areas of improvement and mess that we are leaving behind.

## Installation
Lets install `campsite` globally.

```
npm install @nexxspace/campsite jest
```

## How it works

1. Before you make any changes in the code. Evaluate the test coverage of current code and form a baseline. To do that, run the following command in your project.

   ```
	$ campsite --baseline
   ```
   
   This in addition to running all unit tests, it also creates a baseline file capturing the `jest` coverage statistics.
   
1. Now change your code. Don't forget to add some unit tests :)

1. Now, lets compare it against the baseline we saved earlier in (1), by running the following command.

   ```
	$ campsite
   ```
   
   This produces a report that looks something like this:
   ![](campsite-baseline-comparison.png)
   
1. __campsite__ shows us the areas we:
   - made some improvements. The "+" (in green)
   - made it worse. The "-" (in red) .
