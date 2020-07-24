Lets see a new method to implement our Tic Tac Toe Game for our Crew. 
Here we are using Reinforcement Learning to implement our Game.
Reinforcement learning is the training of machine learning models to make a sequence of decisions. It is about taking suitable action to maximize reward in a particular situation.
In reinforcement learning, an artificial intelligence faces a game-like situation. The computer employs trial and error to come up with a solution to the problem.
Reinforcement learning differs from the supervised learning in a way that in supervised learning the training data has the answer key with it so the model is trained with the correct answer itself whereas in reinforcement learning, there is no answer but the reinforcement agent decides what to do to perform the given task. 
In the absence of a training dataset, it is bound to learn from its experience.
In this our agent works on the reward system, whenever it comes up with a suitable outcome, it gets a positive reward, else, it gets a negative reward and trains itself.

##Strategy used-
1. We use epsilon decreasing strategy
2. Initializing variable epsilon to 0.3
3. Now with probability = epsilon, we explore and with probability = 1-epsilon, we exploit.
4. We decrease the value of epsilon over time until it becomes zero

The agent can explore better actions during the earlier stages of the training, and then it exploits the best actions in the later stages of the game. 
It’s kind of similar to how us humans function.

We have tried to implement this learning model for nearly 10,000 AI games. 
This model and the trained datasets does not give an unbeatable game but with more training steps, we can train our AI agent which can give a good competition to our Human Player!!
