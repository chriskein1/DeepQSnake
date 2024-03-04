export default class QAgent {
  constructor(actions, learningRate = 0.1, discountFactor = 0.9, explorationRate = 0.01) {

    // Set of all possible actions
    this.actions = actions;

    // Hyperparameters
    this.learningRate = learningRate;
    this.discountFactor = discountFactor;
    this.explorationRate = explorationRate;        // Greedy action rate (exploration vs exploitation)
    this.qTable = {};
  }

  getQValue(state, action) {

    // If the has not been explored at all, create empty object
    if (!this.qTable[state]) {
      this.qTable[state] = {};
    }

    // If the state action pair has not been explored, then its Q value is 0
    if (!this.qTable[state][action]) {
      this.qTable[state][action] = 0;
    }

    // Get stored Q value
    return this.qTable[state][action];
  }

  updateQValue(state, action, reward, nextState) {
    // Belleman equation
    // Qnew(s, a) = Q(s, a) + alpha * (R(s, a) + gamma * maxQ'(s', a') - Q(s, a))
    // Where alpha is the learning rate and gamma is the discount factor

    // Get the max Q value for the next state for all possible actions
    const maxNextQValue = this.getMaxQValue(nextState);

    // Get the current Q value
    const currentValue = this.getQValue(state, action);

    // Compute using the Belleman equation
    const newValue = currentValue + this.learningRate * (reward + this.discountFactor * maxNextQValue - currentValue);
    this.qTable[state][action] = newValue;
  }

  getMaxQValue(state) {
    // If the state has not been explored, then the max Q value is 0
    if (!this.qTable[state]) {
      return 0;
    }

    // Otherwise, get the largest Q value for all recorded actions
    return Math.max(...Object.values(this.qTable[state]), 0);
  }

  getAction(state) {

    // Greedy action
    if (Math.random() < this.explorationRate) {
      console.log("Random");
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    }

    // Get all Q values for state
    const qValues = this.qTable[state] || {};
    let maxAction = null;
    let maxQValue = -Infinity;

    // Explore all actions for the state and get the maximum action
    for (const action of this.actions) {
      // If the action action has not been explored yet, its value is 0
      const qValue = qValues[action] || 0;

      // Update max Q value found so far
      if (qValue > maxQValue) {
        maxQValue = qValue;
        maxAction = action;
      }
    }

    return maxAction;
  }

  // Prevent illegal actions (snake can't go backwards)
  getNewAction(state, illegalAction) {

    // Get the valid actions by excluding the illegal action
    let validActions = this.actions
    validActions.splice(validActions.indexOf(illegalAction), 1);
    console.log("Illegal action: ", illegalAction);
    console.log("Valid actions: ", validActions)

    // Greedy action 
    if (Math.random() < this.explorationRate) {
      console.log("Random");

      return validActions[Math.floor(Math.random() * validActions.length)];
    }

    // Get all Q values for state
    const qValues = this.qTable[state] || {};
    let maxAction = null;
    let maxQValue = -Infinity;

    // Explore all actions for the state and get the maximum action
    for (const action of this.actions) {
      const qValue = qValues[action] || 0;

      // Update max Q value found so far for the valid actions
      if (qValue > maxQValue && (action[0] !== illegalAction[0] && action[1] !== illegalAction[1])) {
        maxQValue = qValue;
        maxAction = action;
      }
    }

    return maxAction;
  }

  // Save stringified Q table
  saveQTable() {
    localStorage.setItem("Q_Table", JSON.stringify(this.qTable));
  }

  // Load stringified Q table
  loadQTable() {
    // Load empty if not found
    this.qTable = JSON.parse(localStorage.getItem("Q_Table")) || {};
  }
}
