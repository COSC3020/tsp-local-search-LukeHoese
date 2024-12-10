// distance must be calculated in multiple locations so we will set up a helper function for calculating distance
function calcDistance(route, distance_matrix) {
    // initialize distance to 0
    let distance = 0;
    // loop over each city in our path
    for (let i = 0; i < route.length - 1; i++) {
        // add to the distance the value in the distance matrix at our current city and the next city in our route
        distance += distance_matrix[route[i]][route[i+1]];
    }
    // returns distance
    return distance;
}

// our 2optSwap as outlined in original problem
function twoOptSwap(route, i, k) {
    let newRoute = [...route];
    [newRoute[i], newRoute[k]] = [newRoute[k], newRoute[i]];
    return newRoute;
}

function tsp_ls(distance_matrix) {
    // initialize cities to the number of cities in our matrix
    let cities = distance_matrix.length;
    // create a new array called route that has a length of the number of cities, during creating we will map so that we ignore value and only take index
    let route = Array.from({length: cities}, (_, index) => index);

    // random shuffle algorithm taken from chatGPT. I will explain to show understanding

    // loop for the amount of cities we have, working backward from highest index.
    for (let i = cities - 1; i > 0; i--) {
        // we will pick our j by generating a random floating point number from 0 to 1, multiplying it by our range (i + 1), and then flooring that to get an integer
        let j = Math.floor(Math.random() * (i + 1));
        // swap element at i with our randome element
        [route[i], route[j]] = [route[j], route[i]];
    }

    // initialize our shortest route to our starting route
    let shortestRoute = route;
    // initialize our shortest distance to the distance calculated for our starting route
    let shortestDist = calcDistance(route, distance_matrix)

    // for our stopping criteria, we will track how many iterations we've gone with 0 improvements. For my implementation I will set it to stop after 100 iterations with no improvement, but this number can very easily be changed to fit other desired stop criteria
    let noImprovement = 0;
    let maxNoImprovement = 100;

    // loop for as long as our iterations without improvement variable is less than our max iterations without improvement variable
    while (noImprovement < maxNoImprovement) {
        // initialize a variable to track whether or not our loop has found an improvement
        let improvment = false;

        // we will pick our indices for swapping using these two loops, which set i and k by both looping over the cities
        for (let i = 0; i < cities - 1; i++) {
            // we initialize k to be i + 1 at every iteration of the outer loop to ensure that k is always greater than i, so we avoid repeating swaps. this is also why we only go to the second to last city in our outer loop (i < cities - 1)
            for (let k = i + 1; k < cities; k++) {
                // make a new route swapping our current i and k values
                let newRoute = twoOptSwap(route, i, k);
                // calculate the distance of our new route
                let newDist = calcDistance(newRoute, distance_matrix);

                // if the distance of our new route is shorter than our previous shortest distance, we change our shortest route and shortest distance to be our new route and new routes distance
                if (newDist < shortestDist) {
                    shortestRoute = newRoute;
                    shortestDist = newDist;
                    // set improvement to true so we can reset our stop criteria accordingly
                    improvment = true;
                    // break our loop since an improvement has been found
                    break;
                }
            }
            if(improvment) {
                // break again if improvement has been set to true
                break;
            }
        }
        if (!improvment) {
            // if no improvement was found we will increment our iterations without improvement count
            noImprovement++;
        }
        else {
            // if improvement has been found (previous if statement is skipped) we will reset our iterations without improvement count to 0
            noImprovement = 0;
        }
    }

    // return the shortest path found after we've gone 100 iterations with no improvement
    return shortestDist;
}