const fs = require('fs');
const path = require('path');
const Choice = require('../models/Choice');
const config = require('../config');

const imageDirectory = path.join(__dirname, '..', 'images');
let shownPairs = new Set();

const getImages = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(imageDirectory, (err, files) => {
            if (err) {
                return reject('Unable to scan directory: ' + err);
            }
            const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
            if (imageFiles.length < 2) {
                return reject('Not enough images in the folder');
            }

            const totalPairs = (imageFiles.length * (imageFiles.length - 1)) / 2;

            if (shownPairs.size >= totalPairs) {
                return reject('All pairs have been shown');
            }

            let pair;
            do {
                const randomIndex1 = Math.floor(Math.random() * imageFiles.length);
                const randomIndex2 = (randomIndex1 + Math.floor(Math.random() * (imageFiles.length - 1)) + 1) % imageFiles.length;
                pair = [imageFiles[randomIndex1], imageFiles[randomIndex2]];
                pair.sort();
            } while (shownPairs.has(pair.toString()) && shownPairs.size < totalPairs);

            shownPairs.add(pair.toString());
            resolve(pair);
        });
    });
};

const recordChoice = async (choice, other) => {
    const newChoice = new Choice({ choice, other });
    await newChoice.save();
    return newChoice;
};

module.exports = { getImages, recordChoice };
