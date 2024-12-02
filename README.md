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

### Atak typu Reflected XSS

Poniżej postów widoczne są dwie tabele, które pomogą w wizualizacji i zrozumieniu przeprowadzanego ataku Reflected XSS.

Tabela oznaczona jako Client Side pokazuje nazwę i wartość parametru podanego w linku, które są renderowane po stronie klienta, czyli w przeglądarce.

Tabela Server Side pokazuje analogicznie nazwę i wartość parametru, ale renderowanego po stronie serwera.

Użyj wyszukiwarki i wstrzyknij dowolny kod poprzez link URL

<details>
<summary>Rozwiązanie</summary>

przykładowy link
```html
http://localhost:3000/?param=<h1>to jest zainfekowana wiadomość</h1>
```

</details>

### Zabezpieczenie aplikacji

Zabezpiecz stronę przed atakami XSS typu Reflected

Warto zauważyć, że dane wyświetlane za pomocą Server Side Rendering są ujęte w tagi charakterystyczne dla formatu `EJS` - `<%`.

Zapoznaj się z [dokumentacją](https://ejs.co/#docs) EJS, zwróć uwagę na różnice między różnymi tagami.

Przeanalizuj kod znajdujący się w pliku [index.ejs](./xss-app/src/views/index.ejs) i użyj odpowiednich tagów tak, aby kod HTML nie był renderowany. Poprawne rozwiązanie zadania poskutkuje różnym wyświetlaniem wartości zainfekowanych parametrów w tabelach Client Side oraz Server Side.

<details>
<summary>Rozwiązanie</summary>

oryginalny fragment kodu:
```html
      <tbody>
        <% queryParams.forEach(param => { %>
          <tr>
              <td><%- param.name %></td>
              <td><%- param.value%></td>
          </tr>
        <%}); %>
      </tbody>
```

zmieniony fragment kodu
```html
      <tbody>
        <% queryParams.forEach(param => { %>
          <tr>
              <td><%= param.name %></td>
              <td><%= param.value%></td>
          </tr>
        <%}); %>
      </tbody>
```

</details>

## Zadanie 3.

`ToDo..`