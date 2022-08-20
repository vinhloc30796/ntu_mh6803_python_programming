# ntu_mh6803_python_programming
Group project for NTU MSFT, MH6803 course, Python Programming

## Development Instructions

### Requirements

* Python 3.9+
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
* Depending on your role:
    * To trigger Notebook, run `poetry run jupyter notebook` or `poetry run jupyter lab` (whichever you prefer)
    * To run the program, run `poetry run python extract.py BTC`
