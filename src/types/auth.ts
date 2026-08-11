export type SignupContext = {
  email: string;
  // OAuth プロバイダが name を返さない場合は空文字が入る
  nickname_suggestion: string;
};
