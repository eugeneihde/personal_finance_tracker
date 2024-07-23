# Personal Finance Tracker

## About the Project

- **Note:** This is a Work in Progress (WIP) Project and may still contain bugs or unfinished sections.
- See [Roadmap](#roadmap) for planned features.

## General

- This application is built with Next.js and stores data in a MySQL database.
- Currently, it uses the default NextAuth Credentials Provider for authentication. In future releases, authentication will be implemented with [Keycloak](https://www.keycloak.org/).

## Getting Started

### Prerequisites

- Ensure that you have the following software installed on your system:
  - Docker
  - docker-compose


### Environment Setup

1. Create a `.env` file in the root directory with the following configuration:
    ```rb
    BASE_URL='http://localhost:3000'
    SYSTEM_API_KEY=
    MYSQL_HOST=mysql
    MYSQL_PORT=3306
    MYSQL_DATABASE=finance_tracker
    MYSQL_USER=root
    MYSQL_PASSWORD=root
    MYSQL_ROOT_PASSWORD=root
    MYSQL_DATABASE=finance_tracker
    NEXTAUTH_SECRET=
    NEXTAUTH_URL='http://localhost:3000'
    ```

2. Create random keys for `SYSTEM_API_KEY` and `NEXTAUTH_SECRET` using the following commmand:
    ```shell
    openssl rand -base64 32
    ```

### Running the Application

1. Navigate to the root directory of the project.

2. Install all dependencies with `npm install`

3. Build and start the application using Docker Compose:
    ```shell
    docker-compose up --build
    ```

4. The application will be accessible at [http://localhost:3000](http://localhost:3000).


## Project Structure

- `/app` : Contains the main application code.
- `/db` : Database related models and configurations.
- `/config` : Configuration files for the project.
- `/components` : Reusable UI components.
- `/public` : Public assets like e.g. stylesheets.

## Roadmap

- Automatic Session update after the user changed his profile data.
- Enhanced Data Filtering in Dashboard.
- Authentication using the [Keycloak](https://www.keycloak.org/) Provider.
- Recurring Transactions.
- Detailled Spending statistics using [D3.js](https://d3js.org/).
- Budget Planning and Tracking
- …