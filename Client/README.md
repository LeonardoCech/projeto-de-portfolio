# Minhas Finanças

## Summary

- [Available Scripts](#available-scripts)
- [Using Docker Container for Development](#using-docker-container-for-development)
- [Git commit pattern](#git-commit-pattern)
    - [Git Commit Message Guidelines](#git-commit-message-guidelines)
    - [Commit Message Structure](#commit-message-structure)
        - [Header](#header)
        - [Body](#body)
        - [Footer](#footer)
    - [Examples](#examples)
        - [Adding a Feature](#adding-a-feature)
        - [Bug Fix](#bug-fix)
        - [Documentation Change](#documentation-change)
        - [Refactoring](#refactoring)
        - [Performance Improvement](#performance-improvement)
        - [Footer with Reference](#footer-with-reference)
        - [Breaking Change](#breaking-change)
- [Semantic versioning](#semantic-versioning)
- [Gitflow standards](#gitflow-standards)
    - [Branches](#branches)
        - [Master Branch](#master-branch)
        - [Feature Branches](#feature-branches)
        - [Creating a Feature Branch](#creating-a-feature-branch)
        - [Development Workflow](#development-workflow)
    - [Merging to Master](#merging-to-master)
    - [Deleting Feature Branches](#deleting-feature-branches)
    - [Summary](#summary)

## Available Scripts

In the project directory, you can run:

    npm run start

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

    npm run test

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

    npm run build

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

    npm run eject

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Using Docker Container for Development

**Step 0** Define Environment Variable:

    REACT_APP_ENV=development

**Step 1** Check if a network is created:

    docker network ls

If there is no network named "minhas-financas-network", then create one:

    docker network create --driver bridge minhas-financas-network

---

**Step 2** Build the Docker Image (if necessary):

Check if there is an image named "minhas-financas-minhas-financas:1":

    docker image ls

If it does not exist, you can create it using (in the same directory where the Dockerfile is located):

    docker build --build-arg ENV=development -t minhas-financas-minhas-financas:1 .

---

**Step 3** Run the BNX Minhas Finanças Dev container:

To automatically create the Docker container and run the application:

    docker run --name minhas-financas-minhas-financas --network=minhas-financas-network -p 3000:3000 -d minhas-financas-minhas-financas:1

