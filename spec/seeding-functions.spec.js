const { expect } = require('chai');
const { convertTimeStamp, createRef, renameKeys, formatPairs } = require('../utils/seeding-functions')


describe('convertTimeStamp', () => {
    it('Should return an empty array if passed an empty array', () => {
        const input = []
        const actual = convertTimeStamp(input)
        const expected = []
        expect(actual).to.eql(expected)
        expect(actual).to.not.equal(input)
    });

    it('Should return new array with amended date in object, when passed a single-itemed array', () => {
        const input = [
            {
                title: 'Running a Node App',
                topic: 'coding',
                author: 'jessjelly',
                body:
                    'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
                created_at: 1471522072389
            }
        ]
        const actual = convertTimeStamp(input)
        const expected = [
            {
                title: 'Running a Node App',
                topic: 'coding',
                author: 'jessjelly',
                body:
                    'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
                created_at: new Date(1471522072389)
            }
        ]
        expect(actual).to.eql(expected)
        expect(actual).to.not.equal(input)
    });

    it('Should return new array with amended date on all objects, when passed an array with mulitple items', () => {
        const input = [
            {
                title: 'Running a Node App',
                topic: 'coding',
                author: 'jessjelly',
                body:
                    'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
                created_at: 1471522072389
            },
            {
                title:
                    "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
                topic: 'coding',
                author: 'jessjelly',
                body:
                    'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
                created_at: 1500584273256
            }
        ]
        const actual = convertTimeStamp(input)
        const expected = [
            {
                title: 'Running a Node App',
                topic: 'coding',
                author: 'jessjelly',
                body:
                    'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
                created_at: new Date(1471522072389)
            },
            {
                title:
                    "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
                topic: 'coding',
                author: 'jessjelly',
                body:
                    'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
                created_at: new Date(1500584273256)
            }
        ]
        expect(actual).to.eql(expected)
        expect(actual).to.not.equal(input)
    });

});

describe('createRef', () => {
    it('returns an empty object, when passed an empty array', () => {
        const input = [];
        const actual = createRef(input);
        const expected = {};
        expect(actual).to.eql(expected);
    });

    it("returns an object with a single item when passed an array containing one object", () => {
        let input = [
            { name: 'vel', phoneNumber: '01134445566', address: 'Northcoders, Leeds' }
        ];
        let actual = createRef(input);
        let expected = { 'vel': '01134445566' };
        expect(actual).to.eql(expected);
        input = [
            { name: 'ant', phoneNumber: '01612223344', address: 'Northcoders, Manchester' }
        ];
        actual = createRef(input);
        expected = { "ant": '01612223344' };
        expect(actual).to.eql(expected);
    });

    it("returns an object with multiple items when passed an array containing multiple objects", () => {
        const input = [
            { name: 'vel', phoneNumber: '01134445566', address: 'Northcoders, Leeds' },
            { name: 'ant', phoneNumber: '01612223344', address: 'Northcoders, Manchester' }
        ];
        const actual = createRef(input);
        const expectedOutcome = { 'vel': '01134445566', "ant": '01612223344' };
        expect(actual).to.eql(expectedOutcome);
    });

    it("returns an object with single item where key/val is specified in the parameters", () => {
        const input = [
            { name: 'vel', phoneNumber: '01134445566', address: 'Northcoders, Leeds' }
        ];
        const actual = createRef(input, 'name', 'address');
        const expectedOutcome = { 'vel': 'Northcoders, Leeds' };
        expect(actual).to.eql(expectedOutcome);
    });

    it("returns an object with multiple items where key/val is specified in the parameters", () => {
        const input = [
            { name: 'vel', phoneNumber: '01134445566', address: 'Northcoders, Leeds' },
            { name: 'ant', phoneNumber: '01612223344', address: 'Northcoders, Manchester' }
        ];
        const actual = createRef(input, 'name', 'address');
        const expectedOutcome = { 'vel': 'Northcoders, Leeds', 'ant': 'Northcoders, Manchester' };
        expect(actual).to.eql(expectedOutcome);
    });

});

describe('renameKeys', () => {
    it('returns a new empty array, when passed an empty array', () => {
        const albums = [];
        const keyToChange = '';
        const newKey = '';
        const actual = renameKeys(albums, keyToChange, newKey);
        const expected = [];
        expect(actual).to.eql(expected);
        expect(actual).to.not.equal(albums);
    });

    it('returns a new array with the key changed, when passed an array with a single item', () => {
        const albums = [{ title: 'Slaughterhouse-Five', writtenBy: 'Kurt Vonnegut' }];
        const keyToChange = 'writtenBy';
        const newKey = 'author';
        const actual = renameKeys(albums, keyToChange, newKey);
        const expected = [{ title: 'Slaughterhouse-Five', author: 'Kurt Vonnegut' }];
        expect(actual).to.eql(expected);
        expect(actual).to.not.equal(albums);
    });

    it('returns a new array with the key changed, when passed an array with multiple items', () => {
        const albums = [{ title: 'Slaughterhouse-Five', writtenBy: 'Kurt Vonnegut' },
        { title: 'Sirens of Titan', writtenBy: 'Kurt Vonnegut' }];
        const keyToChange = 'writtenBy';
        const newKey = 'author';
        const actual = renameKeys(albums, keyToChange, newKey);
        const expected = [{ title: 'Slaughterhouse-Five', author: 'Kurt Vonnegut' },
        { title: 'Sirens of Titan', author: 'Kurt Vonnegut' }];
        expect(actual).to.eql(expected);
        expect(actual).to.not.equal(albums);
    });

});

describe('formatPairs', () => {
    it('returns a new empty array, when passed an empty array', () => {
        const albums = [];
        const artistLookup = {};
        const actual = formatPairs(albums, artistLookup);
        const expected = [];
        expect(actual).to.eql(expected);
        expect(actual).to.not.equal(albums);
    });

    it('changes the value of an item in a single-itemed array', () => {
        const albums = [{ name: "I Don't Want To Grow Up", article_id: 'Descendents', releaseYear: 1985 }];
        const artistLookup = { Descendents: 9923 };
        const actual = formatPairs(albums, artistLookup);
        const expected = [{ name: "I Don't Want To Grow Up", article_id: 9923, releaseYear: 1985 }];
        expect(actual).to.eql(expected);
        expect(actual).to.not.equal(albums);
    });

    it('changes the value for each item in an array', () => {
        const albums = [
            { name: "I Don't Want To Grow Up", article_id: 'Descendents', releaseYear: 1985 },
            { name: "Rain Dogs", article_id: 'Tom Waits', releaseYear: 1985 }
        ];
        const artistLookup = { 'Descendents': 9923, 'Tom Waits': 9924 };
        const actual = formatPairs(albums, artistLookup);
        const expected = [
            { name: "I Don't Want To Grow Up", article_id: 9923, releaseYear: 1985 },
            { name: "Rain Dogs", article_id: 9924, releaseYear: 1985 }
        ];
        expect(actual).to.eql(expected);
        expect(actual).to.not.equal(albums);
    });

});
