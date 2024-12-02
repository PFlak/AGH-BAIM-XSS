# Aplikacja podatna na ataki XSS

## Uruchamianie środowiska

Aby uruchomić aplikację webową należy być w folderze xss-app.

```bash
cd xss-app 
```

Następnie powinno się zainstalować zależności

```bash
npm install
```

Po wpisaniu poniższej komendy możemy korzystać z aplikacji pod adresem `localhost:3000`

```bash
npm run dev
```

# Zadania

Celem zadań jest przeprowadzenie oraz zabezpieczenie aplikacji przed atakami typu XSS.

Do celów wykonywania zadań stworzona została prosta aplikacja webowa. Po jej uruchomieniu w karcie naszej przeglądarki (Firefox) otrzymujemy indywidualne `ID` stając się klientem [socketu](https://socket.io).
> [!NOTE]
> Uwaga, każda karta posiada inne ID oraz jest innym klientem

Każdy klient ma możliwość publikowania oraz otrzymywania postów w czasie rzeczywistym
> [!WARNING]
> Przeładowanie karty skutkuje otrzymaniem nowego ID

## Zadanie 1.

### Atak typu Stored XSS

Nasza aplikacja ma parę wad. Jedną z nich jest brak zabezpieczeń przed atakami XSS typu Stored.

Przeprowadź taki atak powodując ujawnienie pozycji naszej myszki w konsoli.

<details>
<summary>Rozwiązanie</summary>

Zamieść przykłądowy post:
```
<img src='*' onmouseover="document.addEventListener('mousemove', (event) => {
    console.log(`Mouse moved to: X=${event.clientX}, Y=${event.clientY}`);
  });"/>
```
</details>

### Zabezpieczenie aplikacji

Jedną z metod zapobiegania ataków XSS typu stored jest tzw. [sanityzacja](https://bito.ai/resources/sanitize-input-javascript-javascript-explained/), która zapobiega zapisywaniu zainfekowanych wiadomości w bazie danych.
Zabezpiecz naszą aplikacje implementując [funkcję](./xss-app/src/utils/sanitizeInput.ts) do sanityzacji danych wejściowych.

<details><summary>Rozwiązanie</summary>

Funkcja w pliku `/xss-app/utils/sanitizeInput.ts`
```typescript
const sanitizeInput = (input: string): string => {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
      };
    
      const reg: RegExp = /[&<>"'/]/g;
    
      return input.replace(reg, (match: string): string => map[match]);
}
```
</details>

## Zadanie 2.

`ToDo..`

## Zadanie 3.

### Atak typu DOM-based XSS

Nasza aplikacja nie jest zabezpieczona również przed atakiem XSS typu DOM-based.

Aby przetestować działanie wpisz w pasek URL przykładowo:

`http://localhost:3000/?param1=<h1>hello</h1>`

### Zabezpieczenie aplikacji

DOM-based XSS jest najczęściej spowodowany użyciem złej metody w JavaScript do wyświetlania danych na stronie. Powinno się unikać używania metody `innerHTML`, ponieważ jest ona niebezpieczna. 

Zamień użycie `innerHTML` w plikach aplikacji na bezpieczne metody takie jak `innerText`.

<details><summary>Rozwiązanie</summary>

```typescript
// app.js file
msgAuthorDiv.innerText = `${messageObj.clientId !== socket.id ? messageObj.clientId : 'you'}:`; 
msgContentDiv.innerText = messageObj.content;
msgTimestampDiv.innerText = formatDate(messageObj.timestamp);

// queryParams.js
nameTd.innerText = name;
valueTd.innerText = value;
```
</details>
