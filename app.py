from flask import Flask, request, render_template, jsonify, session
from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "fdfgkjtjkkg45yfdb"

boggle_game = Boggle()


@app.route("/")
def rootPage():

    board = boggle_game.make_board()
    session['board'] = board
    highestScore = session.get("highestScore", 0)
    playNumber = session.get("playNumber", 0)

    return render_template("index.html", board=board,
                           highestScore=highestScore,
                           playNumber=playNumber)


@app.route("/word-checker")
def check_word():
    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})


@app.route("/post-score", methods=["POST"])
def post_score():

    userScore = request.json["userScore"]
    highestScore = session.get("highestScore", 0)
    playNumber = session.get("playNumber", 0)

    session['playNumber'] = playNumber + 1
    session['highestScore'] = max(userScore, highestScore)

    return jsonify(brokeRecord=userScore > highestScore)
