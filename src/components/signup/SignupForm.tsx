"use client";

import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupFormSchema, type SignupFormData } from "@/schemas/auth";
import { useSignupForm } from "@/hooks/signup/useSignupForm";
import { useUsernameCheck } from "@/hooks/signup/useUsernameCheck";
import styles from "./styles/SignupForm.module.css";

export function SignupForm() {
  const { onSubmit } = useSignupForm();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
  });

  const username = useWatch({ control, name: "username", defaultValue: "" });
  const { status } = useUsernameCheck(username);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <Image
            src="/images/shelfie-text-logo.png"
            alt="Shelfie"
            width={140}
            height={40}
            style={{ height: "auto" }}
            priority
          />
        </div>

        <h1 className={styles.heading}>プロフィールを設定しましょう</h1>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              ユーザー名
            </label>
            <input
              id="username"
              {...register("username")}
              className={`${styles.input} ${errors.username ? styles.inputError : ""}`}
              placeholder="yuki_reads"
              autoComplete="username"
            />
            <p className={styles.hint}>
              他のユーザーに表示される ID です（変更不可）
            </p>
            {errors.username ? (
              <p className={styles.error}>{errors.username.message}</p>
            ) : (
              <>
                {status === "checking" && (
                  <p className={styles.checking}>確認中...</p>
                )}
                {status === "available" && (
                  <p className={styles.available}>使用できます</p>
                )}
                {status === "taken" && (
                  <p className={styles.error}>
                    このユーザー名は使用されています
                  </p>
                )}
                {status === "invalid" && (
                  <p className={styles.error}>使用できないユーザー名です</p>
                )}
              </>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="nickname" className={styles.label}>
              ニックネーム
            </label>
            <input
              id="nickname"
              {...register("nickname")}
              className={`${styles.input} ${errors.nickname ? styles.inputError : ""}`}
              placeholder="ゆき"
              autoComplete="nickname"
            />
            {errors.nickname && (
              <p className={styles.error}>{errors.nickname.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              isSubmitting ||
              status === "checking" ||
              status === "taken" ||
              status === "invalid"
            }
            className={styles.submitButton}
          >
            {isSubmitting ? "送信中..." : "はじめる"}
          </button>
        </form>
      </div>
    </div>
  );
}
