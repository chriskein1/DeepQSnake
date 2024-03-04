import * as tf from '@tensorflow/tfjs';

// Neural network class
// Expecting n x m array for game implementation, 4 possible directions
class NeuralNetwork {
    constructor() {
        // Basic dense net
        this.model = tf.sequential();
        this.model.add(tf.layers.flatten({ inputShape: [height, width] }));
        this.model.add(tf.layers.dense({
            // May need tweaking
            units: 64,
            activation: 'relu'
        }));
        // Output layer: 4 possible directions
        this.model.add(tf.layers.dense({
            units: 4,
            activation: 'linear'
        }));
        this.model.compile({
            optimizer: 'adam',
            loss: 'meanSquaredError'    // May need tweaking
        });
    }

    // Predict Q-values for the given state
    predictQ(state) {
        return this.model.predict(tf.tensor([state]));
    }

    // Compute loss between predicted and target Q-values
    computeLoss(predictedQ, targetQ) {
        // Using Mean Squared Error
        return tf.losses.meanSquaredError(targetQ, predictedQ);
    }

    // Train the neural network
    // Directly update the weights based on the loss
    train(state, targetQ) {
        // Get predicted Q-values
        const predictedQ = this.predictQ(state);

        // Compute loss
        const loss = this.computeLoss(predictedQ, targetQ);

        // Update weights using back propagation
        const optimizer = tf.train.adam();
        optimizer.minimize(() => loss);

        return loss;
    }
}