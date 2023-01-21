# Callbacks and asynchronous programming in JavaScript



In the ML5js examples we will see, you will encounter Javascript (JS) functions that are are &ldquo;automatically&rdquo; called when some process (such as training) is finished. This is very common in scripting languages and we might encounter it later as well, when we will look into Python.

Hoepfully, you are probably already familiar with what a function is and the common syntax for defining it in JS, e.g.:

```JavaScript
function myFunction(v) {
    let y = doSomethingWith(v);
    return doSomethingElse(y);
}
```

First of all, when also looking at JS code you might come across this alternative syntax

```JavaScript
let myFunction = (v) => {
    let y = doSomethingWith(v);
    return doSomethingElse(y);
}
```

The two are equivalent. However, the latter, although it looks more cryptic, makes explicit the fact that a function in JS is actually *just another type of variable*.
So `myFunction` is a variable that refers to a function that does something when we **call** it (i.e. we use it!). Calling the function is done by appending the little parentheses and passing in the required parameters:

```JavaScript
myFunction(some_value);
```
Until then, `myFunction` is simply a variable that refers to the function. So you can do something like

```JavaScript
let theSameFunction = myFunction;
myFunction(some_value);
```

and this would have exactly the same effect.

This means that we can pass functions around like we do with other variables, and that includes passing them into other functions, and that is quite convenient!

So let&rsquo;s look at example of [our code](https://editor.p5js.org/colormotor/sketches/hhVI4e8IW) now. In the `setup` function we have this line:

```JavaScript
classifier.classify(img, weKnow);
```

where `classifier` is a previously defined image-classifier object.
Somewhere else in the code we have defined the `weKnow` function, and we are passing the variable corresponding to the function (`weKnow` without the `()`) as a parameter. A function used in this way is commonly referred to as a **callback** (it is passed in to an object or function in order to be called from somewhere else).

After this line, our program will not wait for the classification to happen, but it will keep running as usual (e.g. `draw` might be called a few times). At the same time, the cogs and wheels of the `classifier.classify` function will start turning behind the hood (hence the term &ldquo;asynchronous&rdquo;) until the result is ready. Once the result is ready,
the function we passed in will be called for us. The `classify` function might look something like this

```JavaScript
function classify(image, callback){
    let [result, error] = performComplicatedStuffWithoutBlockingExecution();
    callback(error, result);
}
```

The `classify` function is executed &ldquo;asyncronously&rdquo; so our program keeps on running while the heavy lifting operations are getting executed. In practice, doing so requires additional JS syntax that we won&rsquo;t cover here, since you will probably not need it during the course. However, you can refer to [this tutorial](https://eloquentjavascript.net/11_async.html) (and many others) if you are interested.

Note also that, in this specific case, our definition of the `weKnow` function admits two arguments, `error` and `results`. The callback function should have the right &ldquo;signature&rdquo;, a correct number of arguments so that when it is called it will receive the necessary information. This information is usually specified in the documentation of a given function. For this case look at [the relevant ML5js documentation page](https://learn.ml5js.org/#/reference/image-classifier). Here the correct number of arguments is not explcitly stated in the function documentation but an example is given at the beginning (using the funny `() =>` we have seen earlier).

The important thing to note in general, is that our program will keep running, and at some time (depending on the complexity of the procedure), the callback function we provided (in this case `weKnow` function) will be called automatically. This is convenient because the method does not block the program. However it will require more &ldquo;boilerplate&rdquo; code to handle the results appropriately. E.g. we might want to set a flag so we know that new results are ready.

