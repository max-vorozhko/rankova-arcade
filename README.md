# Rankova Arcade

Музичні міні-ігри від Rankova Studio: вокал, фортепіано, барабани, гітара, кахон, сопілка й етноспів. Зроблені насамперед для телефонів, з рейтингом гравців і кнопкою запису на урок.

| Файл | Що це |
|---|---|
| `index.html` | Уся гра одним файлом. Збирати чи встановлювати нічого не треба. |
| `og-image.png` | Картинка-прев'ю для посилань в Instagram, Telegram і Viber. |
| `firestore.rules` | Правила безпеки для бази рейтингу у Firebase. |

Гра працює й без Firebase. Тоді кожен гравець бачить лише свої рекорди, а спільний рейтинг вимкнений.

## 1. Де живе гра

Гра: **https://max-vorozhko.github.io/rankova-arcade/**

Вона публікується через GitHub Pages з гілки `main` цього репозиторію. Щоб оновити гру, змініть `index.html` (прямо на GitHub через олівець **Edit** або локально і `git push`). Через 1–2 хвилини зміни з'являться на сайті.

## 2. Рейтинг у Firebase (10–15 хвилин)

1. На https://console.firebase.google.com натисніть **Add project**. Google Analytics для цього проєкту не потрібна.
2. **Build → Authentication → Get started → Sign-in method → Anonymous → Enable**. Так кожен гравець отримує свій прихований id без реєстрації.
3. **Authentication → Settings → Authorized domains → Add domain**: додайте `max-vorozhko.github.io`.
4. **Build → Firestore Database → Create database**. Регіон `eur3 (europe-west)`, режим **production**.
5. **Firestore → Rules**: замініть увесь текст вмістом файлу `firestore.rules` і натисніть **Publish**.
6. **Project settings (шестірня) → General → Your apps → Web (`</>`)**: зареєструйте застосунок і скопіюйте з `firebaseConfig` значення `apiKey`, `authDomain`, `projectId`, `appId`.
7. Вставте ці значення в `index.html`, на початку файлу:

```html
window.RANKOVA_FIREBASE = {
  apiKey: "AIza...",
  authDomain: "rankova-arcade.firebaseapp.com",
  projectId: "rankova-arcade",
  appId: "1:123...:web:abc..."
};
```

`apiKey` у Firebase не є секретом, його можна викладати публічно. Захищають базу правила з `firestore.rules`: вони дозволяють гравцеві змінювати тільки власний рекорд, тільки в бік збільшення і не більше за максимум гри.

## 3. Розповсюдження

Посилання для шапки Instagram, Linktree чи сторіз (з мітками, щоб бачити джерело переходів):

```
https://max-vorozhko.github.io/rankova-arcade/?utm_source=ig&utm_medium=social&utm_content=link_in_bio
```

Для сторіз змінюйте `utm_content`, наприклад на `stories_oct`. Кнопки «Записатись на урок» у грі ведуть в Altegio з мітками `utm_source=rankova_arcade` і `utm_content=<гра>`, тому видно, після якої гри людина записалась.

## Аналітика (за бажанням)

Якщо додати в `<head>` код Google Analytics 4 або Meta Pixel, гра сама відправлятиме події:

| Подія | Коли |
|---|---|
| `game_start` | натиснули «Почати» (параметр `game`) |
| `game_finish` | гра скінчилась (`game`, `score`, `new_best`) |
| `share` | натиснули «Кинути виклик другу» |
| `book_click` | клік на «Записатись на урок» (`placement`). У Meta Pixel це подія **Lead**. |

## Модерація

Firebase Console → **Firestore Database → players** → оберіть документ з образливим ніком → **Delete document**.

## Що варто знати

- Рекорди прив'язані до браузера на телефоні. Якщо гравець очистить дані сайту, відкриє гру в іншому браузері, він почне з нуля. Те саме буває, коли Instagram відкриває посилання у своєму вбудованому браузері, а наступного разу гравець заходить через Safari чи Chrome.
- На iPhone звук може не грати, коли ввімкнено беззвучний режим (перемикач збоку). Гра вже просить Safari відтворювати звук попри це, але старі версії iOS цього не підтримують.
- Безкоштовного тарифу Firebase (Spark) вистачить на тисячі гравців на день.
- Правила не захищають від людини, яка навмисно підробить запит у межах максимуму балів. Якщо роздаватимете призи за рейтинг, перевіряйте переможців.

## Версія для claude.ai

`claude-artifact/rankova-arcade.html` — версія гри, опублікована як артефакт на claude.ai: https://claude.ai/artifact/D1sspxnGywPHJSvhBvi1oj. Рейтинг там зберігається в базі артефакту, а не у Firebase. Щоб оновити артефакт, опублікуйте цей файл через Claude з тим самим посиланням.
