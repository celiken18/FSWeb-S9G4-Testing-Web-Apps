import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";
beforeEach(() => {
  render(<IletisimFormu />);
  //   her test icine render etmemiz gerektiginden bunu yazdigimizda gerek kalmaz
});

test("hata olmadan render ediliyor", () => {});

test("iletişim formu headerı render ediliyor", () => {
  // Arrange
  //   render(<IletisimFormu />);
  // Act
  const heading = screen.getByRole("heading", { level: 1 }); //   Butun headingler uzerinde arama yapmasin diye level1 duzeyinde aramasini istiyoruz

  // Asserte
  expect(heading).toBeInTheDocument();
  expect(heading).toBeTruthy();
  expect(heading).toHaveTextContent("İletişim Formu");
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  const kullaniciName = screen.getByLabelText("Ad*");
  userEvent.type(kullaniciName, "test");
  const errorMessage = await screen.findAllByTestId("error");
  expect(errorMessage).toHaveLength(1);
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  const buttonSubmit = screen.getByRole("button");
  userEvent.click(buttonSubmit);
  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    expect(errorMessages).toHaveLength(3);
  });
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  const kullaniciName = screen.getByLabelText("Ad*");
  const soyad = screen.getByLabelText("Soyad*");
  const buttonSubmit = screen.getByRole("button");

  userEvent.type(kullaniciName, "reacttest");
  userEvent.type(soyad, "soyad");
  userEvent.click(buttonSubmit);

  const errorMsg = await screen.findAllByTestId("error");
  expect(errorMsg).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  const email = screen.getByLabelText(/email/i);
  userEvent.type(email, "asd");

  await waitFor(() => {
    const errMsg = screen.getByTestId("error");
    expect(errMsg).toHaveTextContent(
      "email geçerli bir email adresi olmalıdır."
    );
  });
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  const button = screen.getByRole("button");
  userEvent.click(button);

  const errMsg = screen.findByText(/soyad gereklidir./i);
  expect(errMsg).toBeInTheDocument;
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  const kullaniciName = screen.getByLabelText("Ad*");
  const soyad = screen.getByLabelText("Soyad*");
  const button = screen.getByRole("button");
  const email = screen.getByLabelText(/email/i);

  userEvent.type(kullaniciName, "reacttest");
  userEvent.type(soyad, "soyad");
  userEvent.type(email, "test@test.com");
  userEvent.click(button);

  await waitFor(() => {
    const nameInput = screen.queryByText("reacttest");
    const soyadInput = screen.queryByText("soyad");
    const emailInput = screen.queryByText("test@test.com");
    const errMsg = screen.queryAllByTestId("error");

    expect(nameInput).toBeInTheDocument();
    expect(soyadInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(errMsg).toHaveLength(0);
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  const kullaniciName = screen.getByLabelText("Ad*");
  const soyad = screen.getByLabelText("Soyad*");
  const button = screen.getByRole("button");
  const email = screen.getByLabelText(/email/i);
  const msg = screen.getByLabelText(/mesaj/i);

  userEvent.type(kullaniciName, "reacttest");
  userEvent.type(soyad, "soyad");
  userEvent.type(email, "test@test.com");
  userEvent.type(msg, "mesaj yazdim");
  userEvent.click(button);

  await waitFor(() => {
    const msg = screen.queryByTestId("messageDisplay");

    expect(msg).toBeInTheDocument();
  });
});
