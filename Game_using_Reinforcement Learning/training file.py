import numpy as np
from math import inf as infinity
import itertools
import random
import time

game_state = [[' ',' ',' '],
              [' ',' ',' '],
              [' ',' ',' ']]
players = ['X','O']

def play_move(state, player, block_no):
    r_index= int((block_no-1)/3)   #row index
    c_index= (block_no-1)%3        #column index
    if state[r_index][c_index] is ' ':       #block is empty
        state[r_index][c_index] = player
    else:
        block_no = int(input("Block is not empty, Please choose again: "))
        play_move(state, player, block_no)
        
def copy_game_state(state):
    new_state = [[' ',' ',' '],[' ',' ',' '],[' ',' ',' ']]
    for i in range(3):
        for j in range(3):
            new_state[i][j] = state[i][j]
    return new_state
    
def check_current_state(game_state):
    #check horizontal state
    for i in range(0,3):
        if (game_state[i][0] == game_state[i][1] and 
        game_state[i][1] == game_state[i][2] and 
        game_state[i][0] is not ' '):
            return game_state[i][0], "Done"
    
    #check vertical state
    for i in range(0,3):
        if (game_state[0][i] == game_state[1][i] and 
        game_state[1][i] == game_state[2][i] and 
        game_state[0][i] is not ' '):
            return game_state[0][i], "Done"
    
    # Check diagonals state
    if (game_state[0][0] == game_state[1][1] and 
        game_state[1][1] == game_state[2][2] and 
        game_state[0][0] is not ' '):
        return game_state[1][1], "Done"
    if (game_state[2][0] == game_state[1][1] and 
        game_state[1][1] == game_state[0][2] and 
        game_state[2][0] is not ' '):
        return game_state[1][1], "Done"
    
    # Check if draw
    draw_flag = 0
    for i in range(3):
        for j in range(3):
            if game_state[i][j] is ' ':
                draw_flag = 1
    if draw_flag is 0:
        return None, "Draw"
    
    return None, "Not Done"
    
def print_board(game_state):
    print('----------------')
    print('| ' + str(game_state[0][0]) + ' | ' + str(game_state[0][1]) + ' | ' + str(game_state[0][2]) + ' |')
    print('----------------')
    print('| ' + str(game_state[1][0]) + ' | ' + str(game_state[1][1]) + ' | ' + str(game_state[1][2]) + ' |')
    print('----------------')
    print('| ' + str(game_state[2][0]) + ' | ' + str(game_state[2][1]) + ' | ' + str(game_state[2][2]) + ' |')
    print('----------------')
    
# Initialize state values
player = ['X','O',' ']
states_dict = {}
all_possible_states = [[list(i[0:3]),list(i[3:6]),list(i[6:10])] for i in itertools.product(player, repeat = 9)]   #itertools is much faster than simple loops
n_states = len(all_possible_states) # 2 players, 9 spaces
n_actions = 9   # 9 spaces
state_values_for_AI_O = np.full((n_states),0.0)   #global Variables
state_values_for_AI_X = np.full((n_states),0.0)
print("n_states = %i \nn_actions = %i"%(n_states, n_actions))

# State values for AI 'O'
for i in range(n_states):
    states_dict[i] = all_possible_states[i]
    winner, _ = check_current_state(states_dict[i])
    if winner == 'O':   # AI won
        state_values_for_AI_O[i] = 1
    elif winner == 'X':   # AI lost
        state_values_for_AI_O[i] = -1
        
# State values for AI 'X'       
for i in range(n_states):
    winner, _ = check_current_state(states_dict[i])
    if winner == 'O':   # AI lost
        state_values_for_AI_X[i] = -1
    elif winner == 'X':   # AI won
        state_values_for_AI_X[i] = 1
        
def update_state_value_O(curr_state_id, next_state_id, learning_rate):
    # formula P(s)<---P(s) + alpha*(P(s')-P(s))
    new_value = state_values_for_AI_O[curr_state_id] + learning_rate*(state_values_for_AI_O[next_state_id]  - state_values_for_AI_O[curr_state_id])
    state_values_for_AI_O[curr_state_id] = new_value
    
def update_state_value_X(curr_state_id, next_state_id, learning_rate):
    # formula P(s)<---P(s) + alpha*(P(s')-P(s))
    new_value = state_values_for_AI_X[curr_state_id] + learning_rate*(state_values_for_AI_X[next_state_id]  - state_values_for_AI_X[curr_state_id])
    state_values_for_AI_X[curr_state_id] = new_value
   
def getBestMove(state, player, epsilon):
    '''Reinforcement Learning Algorithm'''    
    moves = []
    curr_state_values = []
    empty_cells = []
    for i in range(3):
        for j in range(3):
            if state[i][j] is ' ':
                empty_cells.append(i*3 + (j+1))
    
    for empty_cell in empty_cells:
        moves.append(empty_cell)
        new_state = copy_game_state(state)
        play_move(new_state, player, empty_cell)
        next_state_id = list(states_dict.keys())[list(states_dict.values()).index(new_state)]
        if player == 'X':
            curr_state_values.append(state_values_for_AI_X[next_state_id])
        else:
            curr_state_values.append(state_values_for_AI_O[next_state_id])
        
    print('Possible moves = ' + str(moves))
    print('Move values = ' + str(curr_state_values))    
    best_move_id = np.argmax(curr_state_values)
    
    if np.random.uniform(0,1) <= epsilon:       # Exploration in RL
        best_move = random.choice(empty_cells)
        print('Agent decides to explore! Takes action = ' + str(best_move))
        epsilon *= 0.99
    else:   #Exploitation in RL
        best_move = moves[best_move_id]
        print('Agent decides to exploit! Takes action = ' + str(best_move))
    return best_move

# PLaying

#LOAD TRAINED STATE VALUES
state_values_for_AI_X = np.loadtxt('trained_state_values_X.txt', dtype=np.float64)
state_values_for_AI_O = np.loadtxt('trained_state_values_O.txt', dtype=np.float64)

learning_rate = 0.3
epsilon = 0.3
num_iterations = 10000
for iteration in range(num_iterations):
    game_state = [[' ',' ',' '],
              [' ',' ',' '],
              [' ',' ',' ']]
    current_state = "Not Done"
    print("\nIteration " + str(iteration) + "!")
    print_board(game_state)
    winner = None
    current_player_id = random.choice([0,1])
        
    while current_state == "Not Done":
        curr_state_id = list(states_dict.keys())[list(states_dict.values()).index(game_state)]
        if current_player_id == 0:     # AI_X's turn
            print("\nAI X's turn!")         
            block_choice = getBestMove(game_state, players[current_player_id], epsilon)
            play_move(game_state ,players[current_player_id], block_choice)
            new_state_id = list(states_dict.keys())[list(states_dict.values()).index(game_state)]
            
        else:       # AI_O's turn
            print("\nAI O's turn!")   
            block_choice = getBestMove(game_state, players[current_player_id], epsilon)
            play_move(game_state ,players[current_player_id], block_choice)
            new_state_id = list(states_dict.keys())[list(states_dict.values()).index(game_state)]
        
        print_board(game_state)
        #print('State value = ' + str(state_values_for_AI[new_state_id]))
        update_state_value_O(curr_state_id, new_state_id, learning_rate)
        update_state_value_X(curr_state_id, new_state_id, learning_rate)
        winner, current_state = check_current_state(game_state)
        if winner is not None:
            print(str(winner) + " won!")
        else:
            current_player_id = (current_player_id + 1)%2
        
        if current_state is "Draw":
            print("Draw!")
            
        #time.sleep(1)
print('Training Complete!')    

# Save state values for future use
np.savetxt('trained_state_values_X.txt', state_values_for_AI_X, fmt = '%.6f')
np.savetxt('trained_state_values_O.txt', state_values_for_AI_O, fmt = '%.6f')
