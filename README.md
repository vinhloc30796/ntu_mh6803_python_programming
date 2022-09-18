# ntu_mh6803_python_programming
Group project for NTU MSFT, MH6803 course, Python Programming

## Development Instructions

### Requirements

* Python 3.7+
* Choose either:
    * Poetry (https://poetry.eustace.io/)
        * if you're on Mac, follow this instruction: https://python-poetry.org/docs/#osx--linux--bashonwindows-install-instructions
        * if you're on Windows, then this https://python-poetry.org/docs/#windows-powershell-install-instructions
    * or Venv:
        * run `python -m venv mh6803_python_programming`
        * then `source mh6803_python_programming/bin/activate`
        * then `pip install -r requirements.txt`

(Only if you want to see the web app)

* Node.js 18.2.0+ (maybe older versions would work too, but we haven't tested)
* Run `npm install` in the `frontend` directory

### Steps

* Clone the repository
* File structure:
    * in the `/backend` directory, there are the Python files
        * Run `poetry install` to install the dependencies
        * `cli.py` is the entry point for the CLI
        * `source/` contains the source code, where `main.py` contains most of the functions
        * `tests/` contains the tests
        * `notebooks/` contains the notebooks
        * Worth mentioning:
            * `requirements.txt` contains the requirements
            * `pyproject.toml` contains the project configuration
            * `README.md` (this file!) contains the instructions
    * in the `/frontend` directory, there are TypeScript files
        * Run `npm install` to install the dependencies
        * `src/` contains the source code
        * `components/` contains the React components
        * `pages/` contains the pages (which use the components)
        * `public/` contains the static files
        * Worth mentioning:
            * `package.json` contains the project configuration
            * `tsconfig.json` contains the TypeScript configuration
            * `README.md` contains the instructions (as default from NextJS)
        * `package.json` contains the project configuration
        * `tsconfig.json` contains the TypeScript configuration

### Test

From the `/backend` directory:
* Run `poetry run pytest`
* Video: https://www.loom.com/share/6a002dc823754e5686e6a243a9c3d8ba

## Usage instruction

### CLI

**Method 1: Wizard**
* Run `poetry run python cli.py` to go through the CLI wizard
* Video: https://www.loom.com/share/31f910f24b6645f2b3e73ed7a977bf86

**Method 2: Functions**
* Run `poetry run python source/main.py <command>` to test each component of the wizard 
    * Example 1: `poetry run python source/main.py get_price bitcoin 1656604800 1659283200`
    * Example 2: `poetry run python source/main.py get_coin_description solana`

### GUI

* Run `poetry run python gui.py` to see the GUI
* Click through buttons to enter your choices as guided by the wizard!
* View the background processes in the terminal for debugging if needed.

### Web app

* From the `/backend` directory, run `poetry run python web.py` to see get FastAPI server running
    * The server will be running on `http://localhost:8000`
    * You can check the API documentation at `http://localhost:8000/docs`
    * You can do health-check at `http://localhost:8000/health`
* Then, from the `/frontend` directory, run `npm run dev` to see the frontend running
    * The frontend will be running on `http://localhost:3000`
    * You can check the frontend at `http://localhost:3000`
    * There are two routes available:
        * `/` - the home page
        * `/retire` - the price chart & retirement calculator page
* Video: https://www.loom.com/share/e6e4781c783644abb02901d29e943623

### Jupyter Notebook

From the `/backend` directory:
* Run `poetry run jupyter notebook` or `poetry run jupyter lab` (whichever you prefer)
* Open `notebooks/explore.ipynb` and play around!
