# Installing Python with Miniconda

[Miniconda](https://docs.conda.io/en/latest/miniconda.html) is a small, bootstrap version of [Anaconda](https://docs.conda.io/projects/conda/en/latest/glossary.html#anaconda-glossary) that includes conda, Python, the packages they depend on, and a small number of other useful packages, including pip, zlib and a few others.

[Conda](https://docs.conda.io/projects/conda/en/latest/) is an open-source package and environment management system that runs on Windows, macOS, and Linux. Conda quickly installs, runs, and updates packages and their dependencies. It also easily manages and switches between different (python) environments on your local computer (more on than later). 

If you already have Anaconda or Miniconda installed, you can ignore the rest of this set up.

## How to know if conda is already installed?

### Mac OSX

Open up a Terminal and type ``which conda``

### Windows

Open up a Terminal and type ``where conda``

If it says something to the effect of ``conda not found``, then you are good to continue with your installation.

## Installing Miniconda 

Go to the [Downloads page](https://docs.conda.io/en/latest/miniconda.html) and get the installer for your machine.

### Mac OSX

Is your Mac an M1 or M2?

If so, get the correct installer: Miniconda3 macOS Apple M1 64-bit pkg 

Older intel Macs should use: Miniconda3 macOS Intel x86 64-bit pkg

### Windows

You probably have a 64 bit machine: Miniconda3 Windows 64-bit

Follow the instructions on the installer that runs 

## Checking Installation 

Close any open Terminals or Command Prompts, then reopen a new one 

### Mac OSX

* ``which conda`` should return a message 
* ``which python`` should return a file path to a miniconda installation 

### Windows

* ``where conda`` should return a message 
* ``where python`` should return a file path to a miniconda installation 

