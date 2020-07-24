Lets see a new method to implement our Tic Tac Toe Game for our Crew. 
Here we are using Reinforcement Learning to implement our Game.
Reinforcement learning is the training of machine learning models to make a sequence of decisions. It is about taking suitable action to maximize reward in a particular situation.
In reinforcement learning, an artificial intelligence faces a game-like situation. The computer employs trial and error to come up with a solution to the problem.
Reinforcement learning differs from the supervised learning in a way that in supervised learning the training data has the answer key with it so the model is trained with the correct answer itself whereas in reinforcement learning, there is no answer but the reinforcement agent decides what to do to perform the given task. 
In the absence of a training dataset, it is bound to learn from its experience.
In this our agent works on the reward system, whenever it comes up with a suitable outcome, it gets a positive reward, else, it gets a negative reward and trains itself.

One of the fundamental tradeoffs in reinforcement learning is the exploitation vs exploration tradeoff. 
Exploitation means choosing the action which maximizes our reward(may lead to being stuck in a local optimum). 
Exploration means choosing an action regardless of the reward it provides(this helps us discover other local optimum which may lead us closer to the global optimum). 
Going all out in either one of them is harmful, all exploitation may lead to a suboptimal agent, and all exploration would just give us a stupid agent which keeps taking random actions.
We will be featuring both the trade offs with suitable percentages. 

Strategy used-
1. We use epsilon decreasing strategy
2. Initializing variable epsilon to 0.3
3. Now with probability = epsilon, we explore and with probability = 1-epsilon, we exploit.
4. We decrease the value of epsilon over time until it becomes zero

The agent can explore better actions during the earlier stages of the training, and then it exploits the best actions in the later stages of the game. 
It’s kind of similar to how us humans function.

The method of reinforcement learning used in this implementation is called temporal difference learning. 
It works on the principle that each state has a value attached to it. Say, if a state leads to the AI winning, it shall have a positive value(value = 1). 
If AI loses in some state, it shall have a negative value(value = -1). All the rest of the states would have a neutral value(value = 0). 
These are the initialized state values.

Once a game is started, our agent computes all possible actions it can take in the current state and the new states which would result from each action. 
The values of these states are collected from a state_value vector, which contains values for all possible states in the game. 
The agent can then choose the action which leads to the state with the highest value(exploitation), or chooses a random action(exploration), depending on the value of epsilon. 
Throughout our training, we play several games, after each move, the value of the state is updated using the following rule:
                    P(s)<--- P(s) + alpha*(P(s')-P(s))
                    where, P(s') is afterstate
                           P(s) is current state
                           alpha is the learning rate
                           
 Using this update rule, the states that lead to a loss get a negative state value as well(whose magnitude depends on the learning rate). 
 The agent learns that being in such a state may lead to a loss or a negative reward, so it would try to avoid landing in this state unless necessary. 
 On the other hand, the states that lead to a win, get a positive state value. 
 The agent learns that being in such a state may lead to a win down the line, so it would be encouraged to be in this state.
 
 We have tried to implement this learning model for nearly 10,000 AI games. 
 This model and the trained datasets does not give an unbeatable game but with more training steps, we can train our AI agent which can give a good competition to our Human Player!!
