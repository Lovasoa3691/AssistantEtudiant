from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Utilisateur(db.Model):
    __tablename__ = 'Utilisateur'
    id_ut = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(20), nullable=False)
    prenom = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    mdp = db.Column(db.String(255), nullable=False)

    plannings = db.relationship('Planning', backref='utilisateur')
    revisions = db.relationship('Tache', backref='utilisateur')
    messages = db.relationship('Assistant', backref='utilisateur')


class Planning(db.Model):
    __tablename__ = 'Planning'
    id_plan = db.Column(db.Integer, primary_key=True)
    utilisateur_id_ut = db.Column(db.Integer, db.ForeignKey('Utilisateur.id_ut'), nullable=False)
    date_plan = db.Column(db.Date, nullable=False)
    heure_deb_plan = db.Column(db.Time, nullable=False)
    heure_fin_plan = db.Column(db.Time, nullable=False)
    matiere = db.Column(db.String(20), nullable=False)
    salle = db.Column(db.String(20), nullable=False)
    status_plan = db.Column(db.String(10), nullable=False)


class Tache(db.Model):
    __tablename__ = 'Tache'
    id_tac = db.Column(db.Integer, primary_key=True)
    utilisateur_id_ut = db.Column(db.Integer, db.ForeignKey('Utilisateur.id_ut'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    sujet = db.Column(db.String(20), nullable=False)
    note = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(15), nullable=False)


class Assistant(db.Model):
    __tablename__ = 'Assistant'
    id = db.Column(db.Integer, primary_key=True)
    utilisateur_id_ut = db.Column(db.Integer, db.ForeignKey('Utilisateur.id_ut'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    reponse = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, nullable=False)
