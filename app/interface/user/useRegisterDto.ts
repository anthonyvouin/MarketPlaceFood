export interface UserRegisterDto {
  id: string;
  name: string | null;
  email: string | null;
  password: string;
  emailVerified: Date | null;
  image: string | null;
  role?: string;
}
  