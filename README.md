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

### Steps

* Clone the repository
* Run `poetry install`
* File structure:
    * `cli.py` is the entry point for the CLI
    * `source/` contains the source code, where `main.py` contains most of the functions
    * `tests/` contains the tests
    * `notebooks/` contains the notebooks
* Worth mentioning:
    * `requirements.txt` contains the requirements
    * `pyproject.toml` contains the project configuration
    * `README.md` (this file!) contains the instructions

### Test

* Run `poetry run pytest`
* Video: https://www.loom.com/share/6a002dc823754e5686e6a243a9c3d8ba

## Usage instruction

### CLI

**Method 1:**
* Run `poetry run python cli.py` to go through the CLI wizard
* Video: https://www.loom.com/share/31f910f24b6645f2b3e73ed7a977bf86

**Method 2:**
* Run `poetry run python source/main.py <command>` to test each component of the wizard 
    * Example 1: `poetry run python source/main.py get_price bitcoin 1656604800 1659283200`
    * Example 2: `poetry run python source/main.py get_coin_description solana`

**Method 3: Jupyter Notebook**
* Run `poetry run jupyter notebook` or `poetry run jupyter lab` (whichever you prefer)
* Open `notebooks/explore.ipynb` and play around!
