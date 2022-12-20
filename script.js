PetiteVue.createApp({
  mode: 'top',
  isFemale: true,
  noData: false,
  onQuiz: true, // クイズと結果の画面切り替え
  fewAnswers: false, // 全問回答されたかチェック
  errorFlag: false, // 判定処理で何も選ばれていない
  answers: { f: [], m: [] }, // 回答のリスト
  coinDeg: 0, // 一致度
  judgedNum: 0, // タイプ

  init() {
    // 女性の記録があれば読み込む
    if (localStorage.pms_quiz) {
      this.answers.f = JSON.parse(localStorage.pms_quiz);
    }
  },

  get fm() {
    return this.isFemale ? 'f' : 'm';
  },

  beginQuiz() {
    if (!localStorage.pms_quiz) {
      this.noData = true;
      return;
    }
    this.mode = 'quiz';
    this.isFemale = false;
  },

  /** 結果をローカルストレージに記録 */
  recordAnswers() {
    if (this.answers.f.length != this.quizList.length) {
      this.fewAnswers = true;
      return;
    }
    this.fewAnswers = false;

    localStorage.pms_quiz = JSON.stringify(this.answers.f);

    window.confirm(
      '回答をあなたのブラウザーに記録しました。このあとすぐに男性が回答しない場合は、トップページをブックマークしておくと便利です。'
    );

    this.noData = false;
    this.mode = 'top';
  },

  /** ローカルストレージを削除 */
  deleteData() {
    delete localStorage.pms_quiz;
    window.confirm('ブラウザーに記録していたデータを削除しました。');
    this.mode = 'top';
  },

  /** 一致度を示すために背景色をつける */
  addColor(n_quiz, n_opt) {
    const ans_m = this.answers.m;
    const ans_f = this.answers.f;

    if (ans_f[n_quiz] == n_opt) {
      if (ans_m[n_quiz] == n_opt) {
        return { backgroundColor: 'plum' };
      } else {
        return { backgroundColor: 'palevioletred' };
      }
    } else if (ans_m[n_quiz] == n_opt) {
      return { backgroundColor: 'cornflowerblue' };
    } else {
      return { backgroundColor: 'transparent' };
    }
  },

  /** 結果判定の処理 */
  showResult() {
    // 男性が全問回答したか確認
    if (this.answers.m.length != this.quizList.length) {
      this.fewAnswers = true;
      return;
    }
    this.fewAnswers = false;

    // 女性の回答をローカルストレージから読み出し
    this.answers.f = JSON.parse(localStorage.pms_quiz);
    const ans_m = this.answers.m;
    const ans_f = this.answers.f;

    const n_quiz = this.quizList.length;

    // 一致度を計算
    let sum = 0;
    for (let i = 0; i < n_quiz; i += 1) {
      if (ans_m[i] == ans_f[i]) {
        sum += 1;
      }
    }
    this.coinDeg = Math.round((sum / n_quiz) * 100);

    // タイプを判断
    let typeCnt = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < n_quiz; i += 1) {
      for (const n of this.quizList[i].types[ans_f[i]]) {
        typeCnt[n] += 1;
      }
    }
    console.log(typeCnt);
    this.judgedNum = typeCnt.indexOf(Math.max(...typeCnt));

    this.mode = 'result';
    window.scroll({ top: 0, behavior: 'smooth' });
  },

  /** ★クイズリスト★ */
  quizList: [
    //月経困難症 7問 ----------------------------------------------------------------------------------------------
    // 1問目
    {
      statement: 'あなた(の身近な女性)は月経時どのような状態ですか？最も顕著に出ていると思う症状を選択してください。', // クイズの文章
      options: [
        '生理痛がひどく、学校や会社をよく休んでいる',
        '鎮痛薬(痛み止め)がいつも必要なようである',
        '痛みはあるが、日常生活に支障をきたしている様子はない',
        '月経時以外と様子は変わらない(わからない)'
      ], // 選択肢
      // 0: 正常, 1: 月経困難症, 2: PMS, 3:月経に関する悩みあり, 4:正常, 5:正常
      types: [[1], [1], [0], [0]]
    },
    // 2問目
    {
      statement: 'あなた(の身近な女性)は月経時の症状に変化がありますか？最も当てはまるものを選択してください。',
      options: [
        '月経痛が徐々に強くなっており、以前より月経時に出来ることが減っている',
        '月経時に激しい痛みを感じるようになっており、月経が来ると痛みで外出できない',
        '特に変化は無いと思う',
        '分からない'
      ],
      types: [[1], [1], [0], [0]]
    },
    // 3問目
    {
      statement: 'あなた(の身近な女性)の月経痛の強さはどの程度ですか？最も当てはまるものを選択してください。',
      options: [
        '市販の鎮痛薬(痛み止め)を服用しても痛みが強く、動くことがしんどそうである',
        '鎮痛薬(痛み止め)が利かなくなってきており、飲む日数が増えているように感じる',
        '鎮痛薬(痛み止め)を服用すれば平気そうである',
        '特に痛みを感じている様子はなさそうである(わからない)'
      ],
      types: [[1], [1], [0], [0]]
    },
    // 4問目
    {
      statement:
        'あなた(の身近な女性)は月経時に月経痛以外の症状はありますか？最も顕著に出ていると思う症状を選択してください。',
      options: [
        '腹部の膨満感を感じている',
        '嘔吐、吐き気がある',
        '貧血気味になっている',
        '特に何もないように見える(わからない)'
      ],
      types: [[1], [1], [1], [0]]
    },
    // 5問目
    {
      statement:
        'あなた(の身近な女性)は月経時や月経時以外にどのような症状がありますか？最も顕著に出ていると思う症状を選択してください。',
      options: [
        '痛み止めを飲まないと体を動かせない',
        '月経時以外にも痛みが起こっている',
        '下腹部の痛み以外に下痢や排便時の痛みを伴っている',
        '目立った症状はない(わからない)'
      ],
      types: [[1], [1], [1], [0]]
    },
    // 6問目
    {
      statement: 'あなた(の身近な女性)は月経時に月経痛以外にどのような症状がありますか？最も顕著に出ていると思う症状を選択してください',
      options: ['だるく疲れた気持ちになっている', '腰の痛みを感じている', 'お手洗いに行く回数が増えている', '特に何もないように思う(わからない)'],
      types: [[0], [2], [2], [2]]
    },
    // 7問目
    {
      statement: 'あなた(の身近な女性)は月経時に出かける際、変化はありますか？',
      options: [
        '以前から約束していた予定がある際に、急に月経が始まり、月経痛がひどく動けないため約束を断った(断られた)ことがある',
        '月経時に身近な男性(女性)と遊んだ際に、痛みがひどくいつも通りの状態ではなかった時がある',
        '月経時でも特に変わらず遊ぶことができている',
        '覚えていない(わからない)'
      ],
      types: [[2], [2], [2], [2]]
    },

    //PMS 7問 ----------------------------------------------------------------------------------------------
    // 8問目
    {
      statement:
        'あなた(の身近な女性)は月経が始まる3～10日前ごろから普段との変化がありますか？最も顕著に出ていると思う症状を選択してください',
      options: [
        'イライラしている',
        '憂鬱になっている',
        '胸の張りを気にしている',
        '特に変化はないように思う(わからない)'
      ],
      types: [[2], [2], [2], [4]]
    },
    // 9問目
    {
      statement:
        'あなた(の身近な女性)は月経が始まる3～10日前ごろから困っていることはありますか？最も当てはまるものを選択してください',
      options: [
        '集中力が低下してしまうこと',
        '興味や意欲が減退してしまうこと',
        '眠気に襲われてしまうこと',
        '特に何もなく、元気そうだ(わからない)'
      ],
      types: [[2], [2], [2], [4]]
    },
    // 10問目
    {
      statement:
        'あなた(の身近な女性)は月経が始まる3～10日前ごろから悩んでいることはありますか？最も当てはまるものを選択してください',
      options: [
        '食べ過ぎてしまう(過食)',
        '学校や仕事に行けず、家族以外と親密に話せない状態になる',
        '不安感に襲われる',
        '悩みはなさそうに思う(わからない)'
      ],
      types: [[2], [2], [2], [4]]
    },
    // 11問目
    {
      statement:
        'あなた(の身近な女性)が月経前3～10日前ごろから身体的・精神的不快症状が現れること(PMS)により、社会的な行動(仕事や人間関係など)にどのような変化があると思いますか？',
      options: [
        '集中力・作業効率の低下によっていつもの仕事が出来なくなる',
        'だれとも会いたくない、話したくないと感じることに困る',
        '感情のコントロールが出来ないことにより、人間関係に問題を起こしてしまう可能性があり怖い',
        '他３つにあてはまらない(わからない)'
      ],
      types: [[2], [2], [2], [4]]
    },
    // 12問目
    {
      statement: 'あなた(の身近な女性)がPMSを最も感じている期間はいつですか？',
      options: ['10日から6日前', '5日から3日前', '分からない', '感じていないと思う'],
      types: [[2], [2], [0], [4]]
    },
    // 13問目
    {
      statement:
        'あなた(の身近な女性)が仮にPMSの症状を月経10日前から感じている場合、1か月の中でPMSでも月経でもない期間は何日ほどだと思いますか？',
      options: ['約20日', '約15日', '約10日', '約5日'],
      types: [[2], [2], [2], [2]]
    },
    // 14問目
    {
      statement: 'あなた(の身近な女性)がPMSの影響が最も出ていると感じる場面はどこだと思いますか？',
      options: ['仕事(学校)において', '家事において', '人間関係において', '影響は感じていない(わからない)'],
      types: [[2], [2], [2], [4]]
    },

    //月経中の悩み 8問 ----------------------------------------------------------------------------------------------
    // 15問目
    {
      statement:
        'あなたの身近な女性は月経中どのようなことに悩んでいると思いますか？(あなたは月経中どのようなことに悩んでいますか？)最も当てはまると思うものを選択してください',
      options: ['月経痛', '身体のだるさ', '気分の落ち込み', '悩みはないと思う(わからない)'],
      types: [[3], [3], [3], [5]]
    },
    // 16問目
    {
      statement:
        'あなたの身近な女性が月経中に嫌だと感じることは何だと思いますか？(あなたが月経中に嫌だと感じることは何ですか？)最も当てはまると思うものを選択してください',
      options: [
        '経血を気にして、お風呂に先に入れないこと',
        'ナプキンを持ち歩かなくてはならず、荷物が増えること',
        '就寝時、経血の漏れが気になること',
        '特にないと思う'
      ],
      types: [[3], [3], [3], [5]]
    },
    // 17問目
    {
      statement:
        'あなたの身近な女性が月経中に嫌だと感じることは何だと思いますか？(あなたが月経中に嫌だと感じることは何ですか？)最も当てはまると思うものを選択してください',
      options: [
        '月経痛により普段の生活が送れないこと',
        'イライラしてしまい、人間関係が上手くいかないこと',
        'ナプキンをこまめに交換できない状況があること',
        '特にないと思う'
      ],
      types: [[3], [3], [3], [5]]
    },
    // 18問目
    {
      statement:
        'あなたの身近な女性が月経中うまくいかないと感じていることは何だと思いますか？(あなたが月経中うまくいかないと感じていることは何ですか？)最も当てはまると思うものを選択してください',
      options: [
        '仕事(勉強)へのモチベーションが上がらない、集中できない',
        '感情のコントロールがきかない',
        '食欲のコントロールがきかない',
        '何もないと思う'
      ],
      types: [[3], [3], [3], [5]]
    },
    // 19問目
    {
      statement:
        'あなたの身近な女性が月経中うまくいかないと感じていることは何だと思いますか？(あなたが月経中うまくいかないと感じていることは何ですか？)最も当てはまると思うものを選択してください',
      options: [
        'パートナー(または家族)とのコミュニケーションが上手くいかない',
        '上司や同僚とのコミュニケーションが上手くいかない',
        '友人とのコミュニケーションが上手くいかない',
        '何もないと思う'
      ],
      types: [[3], [3], [3], [5]]
    },
    // 20問目
    {
      statement:
        'あなたの身近な女性が月経中に出来ていないと思っていることは何だと考えますか？(あなたが月経中に出来ていないと思っていることは何ですか？)最も当てはまると思うものを選択してください',
      options: [
        '月経中でも普段通りに過ごす',
        '月経の時期や痛みを自分でコントロールする',
        '月経中は無理をしたくない',
        '特にないと思う'
      ],
      types: [[3], [3], [3], [5]]
    },
    // 21問目
    {
      statement:
        'あなたの身近な女性が月経中に出来ていないと思っていることは何だと考えますか？(あなたが月経中に出来ていないと思っていることは何ですか？)',
      options: [
        '月経が重い日に仕事(学校)を休む',
        '月経中であっても気にせずファッションを楽しむ',
        '月経中は無理せずマイペースに過ごす',
        '特にないと思う'
      ],
      types: [[3], [3], [3], [5]]
    },
    // 22問目
    {
      statement: 'あなたの身近な女性が月経中に出来ていないと思っていることは何だと考えますか？',
      options: [
        '生理が重いときは周囲の人に甘える',
        '生理中であってもいつも通りふるまう',
        '困ったときは生理用品の購入をパートナーに頼む',
        '特にないと思う'
      ],
      types: [[3], [3], [3], [5]]
    }
  ],

  /** ★判定結果リスト★ */
  judgmentList: [
    // 判定結果 0
    {
      statement: 'あなた（の身近な女性）は正常な月経で、月経に関する悩みも無いようです',
      links: [
        {
          title: '誰にでも起こる可能性のある、月経困難症とは？',
          url: 'https://www.mochida.co.jp/woman/disease/dysmenorrhea/'
        },
        {
          title: '女性の生理・PMSに対する本音',
          url: 'https://www.tsumura.co.jp/onemorechoice/chigai/survey/'
        }
      ]
    },
    // 判定結果 1
    {
      statement: 'あなた（の身近な女性）は月経困難症かも…',
      links: [
        {
          title: '『月経困難症について：ワタシのカラダ相談室』',
          url: 'https://www.mochida.co.jp/woman/disease/dysmenorrhea/'
        },
        {
          title: '『月経困難症ってどんな病気？』',
          url: 'https://www.fujipharma.jp/patients/dysmenorrhea/about/'
        }
      ]
    },
    // 判定結果 2
    {
      statement: 'あなた（の身近な女性）はPMSかも…',
      links: [
        {
          title: '『PMS(月経前症候群)の原因とセルフケア』',
          url: 'https://www.arax.co.jp/norshinpure/pure/seiri/pms/'
        },
        {
          title: '『PMS(月経前症候群)とは？』',
          url: 'https://www.konicaminolta.jp/michicake/about/about01.html'
        }
      ]
    },
    // 判定結果 3
    {
      statement: 'あなた（の身近な女性）は月経時に悩みを抱えているようです',
      links: [
        {
          title: '生理前、生理中の女性の悩み',
          url: 'https://www.kobayashi.co.jp/brand/inochinohaha/column/taisho.html'
        },
        {
          title: '女性の生理・PMSに対する本音',
          url: 'https://www.arax.co.jp/norshinpure/pure/seiri/pms/'
        }
      ]
    },
    // 判定結果 4
    {
      statement: 'あなた（の身近な女性）は正常な月経で、月経に関する悩みも無いようです',
      links: [
        {
          title: '誰にでも起こる可能性のある、月経困難症とは？',
          url: 'https://www.mochida.co.jp/woman/disease/dysmenorrhea/'
        },
        {
          title: '女性の生理・PMSに対する本音',
          url: 'https://www.tsumura.co.jp/onemorechoice/chigai/survey/'
        }
      ]
    },
    // 判定結果 6
    {
      statement: 'あなた（の身近な女性）は正常な月経で、月経に関する悩みも無いようです',
      links: [
        {
          title: '誰にでも起こる可能性のある、月経困難症とは？',
          url: 'https://www.mochida.co.jp/woman/disease/dysmenorrhea/'
        },
        {
          title: '女性の生理・PMSに対する本音',
          url: 'https://www.tsumura.co.jp/onemorechoice/chigai/survey/'
        }
      ]
    },
  ]
}).mount();
