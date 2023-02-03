# Installing Tensorflow on Mac M1

If you are working on a Mac M1, there is a chance that incompatibilities between Tensorflow and your conda environment will occur.

Here follows a way of tackling that.

You will need to use Miniforge instead of Anaconda/Miniconda and start the installation from scratch:

- Uninstall Anaconda using [these instructions](https://docs.anaconda.com/anaconda/install/uninstall/)
- Download Miniforge **Miniforge3-MacOSX-arm64.sh** from [this repo](https://github.com/conda-forge/miniforge/releases/tag/22.11.1-2))
- Navigate to your downloads folder (or wherever you kept this downloaded file) and in your Terminal type the following commands:
    - xcode-select --install
    - chmod +x Miniforge3-MacOSX-arm64.sh
    - ./Miniforge3-MacOSX-arm64.sh
    - conda config --set auto_activate_base false
- Then follow [these instructions](https://caffeinedev.medium.com/how-to-install-tensorflow-on-m1-mac-8e9b91d93706) starting from Step 3 and while naming your environment 'dmlap' or whatever you prefer