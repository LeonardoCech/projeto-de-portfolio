# tests/utils.py

# Firebase packages
from firebase_admin import auth, firestore

def unittest_log(test_class, test_name, success, msg):
    return f'''
_________
Test Class: {test_class}
 Unit Test: {test_name}
    Result: {'✔️' if success else '✖️'} {msg[:-1] if msg[-1] == '.' else msg}'''


def delete_test_user():

    try:
        user = auth.get_user_by_email('pytest.temp@we-bronx.io')
    
        if user:
            db = firestore.client()
            firestore_metadata_result = db.collection('users').document(user.uid).delete()

            # Delete user if Firebase Firestore Document Delete is successful
            if firestore_metadata_result:
                
                firestore_oauth_result = db.collection('oauth').document(user.email).delete()

                # Delete user if Firebase Firestore Document Delete is successful
                if firestore_oauth_result:

                    auth.delete_user(user.uid)
                    return True, f'Successfully deleted test user {user.uid} from Firebase Auth and Firestore Collections'

        return False, f'Failed to delete user {user.uid} from Firebase Firestore'
            
    except Exception as error:
        return True, 'User not found in Firebase Auth'