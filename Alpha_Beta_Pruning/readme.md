Our basic aim is to implement a tic tac toe game using Minimax Algorithm. Now lets take another step and make this more efficient. 
In minimax algorithm, all the nodes at a fixed depth(given) are evaluated but what if our algorithm is more smarter to detect the nodes which are not fruitful!!
We can use Alpha Beta Pruning in this case which is a search algorithm that seeks to decrease the number of nodes that are evaluated by the minimax algorithm in its search tree.
This helps to decrease the time complexity of our game.

## Results- For the First move, using simple minimax algorithm, our execution time is about 5 sec. On the other hand, alpha beta pruning takes nearly 0.17 sec to evecute the first move.

Pseudo Code to implement Alpha Beta Pruning- 


function alphabeta(node, depth, α, β, maximizingPlayer) is
     
    if depth = 0 or node is a terminal node then
     return the heuristic value of node
    if maximizingPlayer then
        value := −∞
        for each child of node do
            value := max(value, alphabeta(child, depth − 1, α, β, FALSE))
            α := max(α, value)
            if α ≥ β then
                break (* β cut-off *)
        return value
    else
        value := +∞
        for each child of node do
            value := min(value, alphabeta(child, depth − 1, α, β, TRUE))
            β := min(β, value)
            if β ≤ α then
                break (* α cut-off *)
        return value
