import numpy as np
from math import inf as infinity
import itertools
import random

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
all_possible_states = [[list(i[0:3]),list(i[3:6]),list(i[6:10])] for i in itertools.product(player, repeat = 9)]
n_states = len(all_possible_states) # 2 players, 9 spaces
n_actions = 9   # 9 spaces
state_values_for_AI = np.full((n_states),0.0)
print("n_states = %i \nn_actions = %i"%(n_states, n_actions))

for i in range(n_states):
    states_dict[i] = all_possible_states[i]
    winner, _ = check_current_state(states_dict[i])
    if winner == 'O':   # AI won
        state_values_for_AI[i] = 1
    elif winner == 'X':   # AI lost
        state_values_for_AI[i] = -1
        
def update_state_value(curr_state_id, next_state_id, learning_rate):
    new_value = state_values_for_AI[curr_state_id] + learning_rate*(state_values_for_AI[next_state_id]  - state_values_for_AI[curr_state_id])
    state_values_for_AI[curr_state_id] = new_value
    
def getBestMove(state, player):
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
        curr_state_values.append(state_values_for_AI[next_state_id])
        
    print('Possible moves = ' + str(moves))
    print('Move values = ' + str(curr_state_values))    
    best_move_id = np.argmax(curr_state_values)
    best_move = moves[best_move_id]
    return best_move

# PLaying
    
#LOAD TRAINED STATE VALUES
state_values_for_AI = np.loadtxt('trained_state_values_O.txt', dtype=np.float64)

play_again = 'Y'
while play_again == 'Y' or play_again == 'y':
    game_state = [[' ',' ',' '],
              [' ',' ',' '],
              [' ',' ',' ']]
    current_state = "Not Done"
    print("\nNew Game!")
    print_board(game_state)
    player_choice = input("Choose which player goes first - X (You - the human) or O(The AI): ")
    winner = None
    
    if player_choice == 'X' or player_choice == 'x':
        current_player_id = 0
    else:
        current_player_id = 1
        
    while current_state == "Not Done":
        curr_state_id = list(states_dict.keys())[list(states_dict.values()).index(game_state)]
        if current_player_id == 0: # Human's turn
            block_choice = int(input("Hello Human, your turn! Choose where to place (1 to 9): "))
            play_move(game_state ,players[current_player_id], block_choice)
            
        else:   # AI's turn
            block_choice = getBestMove(game_state, players[current_player_id])
            play_move(game_state ,players[current_player_id], block_choice)
            print("AI plays move: " + str(block_choice))
        
        print_board(game_state)
        winner, current_state = check_current_state(game_state)
        if winner is not None:
            print(str(winner) + " won!")
        else:
            current_player_id = (current_player_id + 1)%2
        
        if current_state is "Draw":
            print("Draw!")
            
    play_again = input('Want to try again?(Y/N) : ')
print('GAME ENDED!')        
