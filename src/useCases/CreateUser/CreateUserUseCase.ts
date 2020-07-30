import { IUserRepository } from "../../repositories/IUsersRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";
import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";

export class CreateUserUseCase {
  constructor(
    private usurRepository: IUserRepository,
    private mailProvider: IMailProvider,
  ) {

  }

  async execute(data: ICreateUserRequestDTO) {
    const userAlreadyExists = await this.usurRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new Error('User already exists.')
    }

    const user = new User(data);

    await this.usurRepository.save(user);

    this.mailProvider.sendMail({
      to: {
        name: data.name,
        email: data.email,
      },
      from: {
        name: 'Equipe do Meu App',
        email: 'equipe@meuapp.com',
      },
      subject: 'Seja bem-vindo à plataforma',
      body: '<p>Você já pode fazer login em nossa plataforma.</p>'
    })
  }
}