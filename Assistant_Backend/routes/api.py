from flask import Blueprint, request, jsonify
from werkzeug.security import  generate_password_hash
from models.models import db, Utilisateur, Planning, Tache

api_blueprint = Blueprint('api', __name__, url_prefix='/api')

@api_blueprint.route('/users', methods=['GET'])
def get_users():
    utilisateurs = Utilisateur.query.all()
    return jsonify([{
        'id': user.id_ut,
        'nom': user.nom,
        'prenom': user.prenom,
        'email': user.email,
    } for user in utilisateurs])


@api_blueprint.route('/planning', methods=['GET'])
def get_planning():
    planning = Planning.query.all()
    return jsonify([
        {
            'id': plan.id_plan,
            'date': plan.date_plan.strftime('%Y-%m-%d'),
            'hdeb': plan.heure_deb_plan.strftime('%H:%M:%S'),
            'hfin': plan.heure_fin_plan.strftime('%H:%M:%S'),
            'matiere': plan.matiere,
            'salle': plan.salle,
        }
        for plan in planning
    ])


@api_blueprint.route('/task', methods=['GET'])
def get_task():
    tasks = Tache.query.all()
    return jsonify([{
        'id': tache.utilisateur_id_ut,
        'id_tac': tache.id_tac,
        'sujet': tache.sujet,
        'note':tache.note,
        'date': tache.date.strftime('%Y-%m-%d'),
    } for tache in tasks])

@api_blueprint.route('/users/<int:id>', methods=['GET'])
def get_user_by_id(id):
    utilisateur = Utilisateur.query.get(id)
    if utilisateur:
        return jsonify({
            'id': utilisateur.id_ut,
            'nom': utilisateur.nom,
            'prenom': utilisateur.prenom,
            'email': utilisateur.email,
        })
    else:
        return jsonify({'message': 'Utilisateur non trouvé'}), 404


@api_blueprint.route('/users', methods=['POST'])
def create_user():
    # data = request.json
    #
    # utilisateur = Utilisateur(
    #     nom=data['nom'],
    #     prenom=data['prenom'],
    #     email=data['email'],
    #     mdp=data['mdp'],
    # )

    utilisateur = Utilisateur(
        nom="fenonantenaiko",
        prenom="lovasoa gilbert julianot",
        email="fenonantenaikolovasoa@gmail.com",
        mdp=generate_password_hash("orion")
    )

    db.session.add(utilisateur)
    db.session.commit()
    return jsonify({'message': 'Utilisateur creer'}), 201

@api_blueprint.route('/planning', methods=['POST'])
def create_planning():
    data = request.get_json()
    planningData = Planning(
        date_plan=data['date'],
        matiere=data['matiere'],
        salle=data['salle'],
        heure_deb_plan=data['hdeb'],
        heure_fin_plan=data['hfin'],
        utilisateur_id_ut=1,
        # utilisateur_id_ut=data['utilisateur'],
        status_plan='A venir',
    )

    db.session.add(planningData)
    db.session.commit()
    return jsonify({'message': 'Planning creer avec succes'}), 201


@api_blueprint.route('/task', methods=['POST'])
def create_task():
    data = request.json
    taskData = Tache(
        date=data['date'],
        sujet=data['sujet'],
        note=data['note'],
        utilisateur_id_ut=data['utilisateur'],
        status='En cours',
    )
    db.session.add(taskData)
    db.session.commit()
    return jsonify({'message': 'Planning creer avec succes'}), 201

@api_blueprint.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.json
    utilisateur = Utilisateur.query.get(id)
    utilisateur.nom = data['nom']
    utilisateur.prenom = data['prenom']
    utilisateur.email = data['email']
    db.session.commit()
    return jsonify({'message': 'Utilisateur modifier'}), 200


@api_blueprint.route('/planning/<int:id>', methods=['PUT'])
def update_planning(id):
    data = request.json
    planning = Planning.query.get(id)
    planning.date_plan=data['date'],
    planning.titre=data['titre'],
    planning.heure_deb_plan=data['hdeb'],
    planning.heure_fin_plan=data['hfin'],

    db.session.add(planning)
    db.session.commit()
    return jsonify({'message': 'Planning modifie avec succes'}), 201


@api_blueprint.route('/task/<int:id>', methods=['PUT'])
def update_task(id):
    data = request.json
    task = Tache.query.get(id)
    task.date=data['date'],
    task.sujet=data['sujet'],
    task.note=data['note'],
    task.statuts_rev='En cours',

    db.session.add(task)
    db.session.commit()
    return jsonify({'message': 'Tache modifie avec succes'}), 201

@api_blueprint.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = Utilisateur.query.get(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Utilisateur supprime'}), 200

@api_blueprint.route('/planning/<int:id>', methods=['DELETE'])
def delete_planning(id):
    planning = Planning.query.get(id)
    db.session.delete(planning)
    db.session.commit()
    return jsonify({'message': 'Planning supprime'}), 200

@api_blueprint.route('/task/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Tache.query.get(id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Taches supprime'}), 200
