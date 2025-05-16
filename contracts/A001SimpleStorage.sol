// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract A001SimpleStorage {
    uint256 public firstNum;
    address public secondAddr;
    uint256 private thirdNum;
    string public fourthStr;
    string public fifthStr;
    uint256[3] public sixthNums;
    uint256[] public seventhNums;

    struct Profile {
        string name;
        uint256 age;
        uint256[] scores;
    }

    Profile public profile;
    Profile[] public profiles;

    mapping(uint256 => address) public numToAddr;
    mapping(address => Profile) public addressToProfile;

    constructor() {
        firstNum = 123;
        secondAddr = address(0x170c025B622060eC23d2b8120F1A082aA8726858);
        thirdNum = 456;
        fourthStr = "Hello World!Hello World!Helloab";
        fifthStr = unicode"メロスは激怒した。必ず、かの邪智暴虐じゃちぼうぎゃくの王を除かなければならぬと決意した。メロスには政治がわからぬ。メロスは、村の牧人である。笛を吹き、羊と遊んで暮して来た。けれども邪悪に対しては、人一倍に敏感であった。きょう未明メロスは村を出発し、野を越え山越え、十里はなれた此このシラクスの市にやって来た。メロスには父も、母も無い。女房も無い。十六の、内気な妹と二人暮しだ。この妹は、村の或る律気な一牧人を、近々、花婿はなむことして迎える事になっていた。結婚式も間近かなのである。メロスは、それゆえ、花嫁の衣裳やら祝宴の御馳走やらを買いに、はるばる市にやって来たのだ。先ず、その品々を買い集め、それから都の大路をぶらぶら歩いた。メロスには竹馬の友があった。セリヌンティウスである。今は此のシラクスの市で、石工をしている。その友を、これから訪ねてみるつもりなのだ。久しく逢わなかったのだから、訪ねて行くのが楽しみである。歩いているうちにメロスは、まちの様子を怪しく思った。ひっそりしている。もう既に日も落ちて、まちの暗いのは当りまえだが、けれども、なんだか、夜のせいばかりでは無く、市全体が、やけに寂しい。のんきなメロスも、だんだん不安になって来た。路で逢った若い衆をつかまえて、何かあったのか、二年まえに此の市に来たときは、夜でも皆が歌をうたって、まちは賑やかであった筈はずだが、と質問した。若い衆は、首を振って答えなかった。しばらく歩いて老爺ろうやに逢い、こんどはもっと、語勢を強くして質問した。老爺は答えなかった。メロスは両手で老爺のからだをゆすぶって質問を重ねた。老爺は、あたりをはばかる低声で、わずか答えた。";
        
        sixthNums[0] = 11;
        sixthNums[1] = 22;
        sixthNums[2] = 33;

        seventhNums.push(111);
        seventhNums.push(222);

        profile.name = "John Doe";
        profile.age = 30;
        profile.scores.push(100);
        profile.scores.push(90);
        profile.scores.push(80);

        profiles.push(Profile({
            name: "Jane Doe",
            age: 28,
            scores: new uint256[](2)
        }));
        profiles[0].scores[0] = 95;
        profiles[0].scores[1] = 85;
        profiles.push(Profile({
            name: "Alice Smith",
            age: 22,
            scores: new uint256[](3)
        }));
        profiles[1].scores[0] = 88;
        profiles[1].scores[1] = 92;
        profiles[1].scores[2] = 78;

        numToAddr[55] = address(0x5B554ddF0D02bb14EbDBD5c558d5fA693d97C21b);
        numToAddr[66] = address(0xC10fF7433f35DB051Ee7fA01fE0B4C76f8D72C75);

        addressToProfile[0xF95b7855f6808fDA0CD940272d1416e89b338cc2].name = "Alice";
        addressToProfile[0xF95b7855f6808fDA0CD940272d1416e89b338cc2].age = 25;
        addressToProfile[0xF95b7855f6808fDA0CD940272d1416e89b338cc2].scores.push(95);
        addressToProfile[0xF95b7855f6808fDA0CD940272d1416e89b338cc2].scores.push(85);
        addressToProfile[0xFfeeBF9dCE4e736314eA2d16984016d4Ae46b428].name = "Bob";
        addressToProfile[0xFfeeBF9dCE4e736314eA2d16984016d4Ae46b428].age = 28;
        addressToProfile[0xFfeeBF9dCE4e736314eA2d16984016d4Ae46b428].scores.push(88);
        addressToProfile[0xFfeeBF9dCE4e736314eA2d16984016d4Ae46b428].scores.push(92);
        addressToProfile[0xFfeeBF9dCE4e736314eA2d16984016d4Ae46b428].scores.push(78);
    }
}
