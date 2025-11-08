import { User } from '../../src/domain/User';

export class UserMother {
    static umUsuarioPadrao() {
        return new User(1, 'John Doe', 'john.doe@example.com', 'PADRAO');
    }

    static umUsuarioPremium() {
        return new User(2, 'Jane Doe', 'jane.doe@example.com', 'PREMIUM');
    }
}