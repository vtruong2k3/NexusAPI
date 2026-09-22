export default {
  batchImageGuide: {
    title: 'Tạo ảnh hàng loạt',
    description: 'Gửi nhiều prompt trong một lần và tải ảnh đã tạo khi hoàn tất'
  },

  home: {
    viewOnGithub: 'Xem trên GitHub',
    viewDocs: 'Xem tài liệu',
    docs: 'Docs',
    switchToLight: 'Chuyển sang chế độ sáng',
    switchToDark: 'Chuyển sang chế độ tối',
    dashboard: 'Dashboard',
    login: 'Đăng nhập',
    getStarted: 'Bắt đầu',
    goToDashboard: 'Vào Dashboard',
    heroSubtitle: 'Một Key, Tất cả mô hình AI',
    heroDescription: 'Không cần quản lý nhiều subscription. Truy cập Claude, GPT, Gemini và nhiều hơn nữa chỉ với một API key',
    tags: {
      subscriptionToApi: 'Subscription to API',
      stickySession: 'Session Persistence',
      realtimeBilling: 'Trả theo dùng'
    },
    painPoints: {
      title: 'Quen thuộc không?',
      items: {
        expensive: {
          title: 'Chi phí Subscription cao',
          desc: 'Trả tiền nhiều subscription AI cộng dồn mỗi tháng'
        },
        complex: {
          title: 'Quản lý rối rắm',
          desc: 'Quản lý tài khoản và API key rải rác trên nhiều platform'
        },
        unstable: {
          title: 'Dịch vụ gián đoạn',
          desc: 'Tài khoản đơn lẻ bị giới hạn tốc độ, làm gián đoạn quy trình làm việc'
        },
        noControl: {
          title: 'Không kiểm soát được',
          desc: 'Không thể theo dõi tiêu thụ hay giới hạn sử dụng cho từng thành viên'
        }
      }
    },
    solutions: {
      title: 'Chúng tôi giải quyết vấn đề này',
      subtitle: 'Ba bước đơn giản để truy cập AI không rắc rối'
    },
    features: {
      unifiedGateway: 'Truy cập một chạm',
      unifiedGatewayDesc: 'Một API key duy nhất để gọi mọi mô hình AI đã kết nối. Không cần ứng dụng riêng biệt.',
      multiAccount: 'Luôn ổn định',
      multiAccountDesc: 'Định tuyến thông minh qua nhiều tài khoản upstream với tự động chuyển dự phòng. Nói lời tạm biệt với lỗi.',
      balanceQuota: 'Trả theo dùng',
      balanceQuotaDesc: 'Tính phí theo mức dùng với giới hạn quota. Minh bạch hoàn toàn về mức tiêu thụ của nhóm.'
    },
    comparison: {
      title: 'Tại sao chọn chúng tôi?',
      headers: {
        feature: 'So sánh',
        official: 'Subscription chính thức',
        us: 'Nền tảng của chúng tôi'
      },
      items: {
        pricing: {
          feature: 'Giá cả',
          official: 'Phí cố định hàng tháng, trả dù không dùng',
          us: 'Chỉ trả cho những gì bạn dùng'
        },
        models: {
          feature: 'Lựa chọn mô hình',
          official: 'Chỉ một nhà cung cấp',
          us: 'Tự do chuyển đổi giữa các mô hình'
        },
        management: {
          feature: 'Quản lý tài khoản',
          official: 'Quản lý riêng từng dịch vụ',
          us: 'Một key duy nhất, một dashboard'
        },
        stability: {
          feature: 'Độ ổn định',
          official: 'Giới hạn tốc độ của tài khoản đơn',
          us: 'Pool đa tài khoản, tự động chuyển dự phòng'
        },
        control: {
          feature: 'Kiểm soát sử dụng',
          official: 'Không có',
          us: 'Quota & phân tích chi tiết'
        }
      }
    },
    providers: {
      title: 'Mô hình AI được hỗ trợ',
      description: 'Một API, Nhiều lựa chọn',
      supported: 'Hỗ trợ',
      soon: 'Sắp ra mắt',
      claude: 'Claude',
      gemini: 'Gemini',
      antigravity: 'Antigravity',
      more: 'Thêm'
    },
    cta: {
      title: 'Sẵn sàng bắt đầu chưa?',
      description: 'Đăng ký ngay và nhận credit dùng thử miễn phí để trải nghiệm truy cập AI liền mạch',
      button: 'Đăng ký miễn phí'
    },
    footer: {
      allRightsReserved: 'Mọi quyền được bảo lưu.'
    }
  },

  keyUsage: {
    title: 'Sử dụng API Key',
    subtitle: 'Nhập API Key của bạn để xem chi tiêu và trạng thái sử dụng theo thời gian thực',
    placeholder: 'sk-ant-mirror-xxxxxxxxxxxx',
    query: 'Truy vấn',
    querying: 'Đang truy vấn...',
    privacyNote: 'Key của bạn được xử lý cục bộ trong trình duyệt và sẽ không được lưu trữ',
    dateRange: 'Khoảng thời gian:',
    dateRangeToday: 'Hôm nay',
    dateRange7d: '7 Ngày',
    dateRange30d: '30 Ngày',
    dateRange90d: '90 Ngày',
    dateRangeCustom: 'Tùy chỉnh',
    apply: 'Áp dụng',
    used: 'Đã dùng',
    detailInfo: 'Thông tin chi tiết',
    tokenStats: 'Thống kê Token',
    dailyDetail: 'Chi tiết hàng ngày',
    modelStats: 'Thống kê sử dụng theo mô hình',
    date: 'Ngày',
    model: 'Mô hình',
    requests: 'Yêu cầu',
    inputTokens: 'Input Tokens',
    outputTokens: 'Output Tokens',
    cacheCreationTokens: 'Cache Creation',
    cacheReadTokens: 'Cache Read',
    cacheWriteTokens: 'Cache Write',
    totalTokens: 'Tổng Tokens',
    cost: 'Chi phí',
    quotaMode: 'Chế độ Quota của Key',
    walletBalance: 'Số dư Wallet',
    totalQuota: 'Tổng Quota',
    limit5h: 'Giới hạn 5 giờ',
    limitDaily: 'Giới hạn hàng ngày',
    limit7d: 'Giới hạn 7 ngày',
    limitWeekly: 'Giới hạn hàng tuần',
    limitMonthly: 'Giới hạn hàng tháng',
    remainingQuota: 'Quota còn lại',
    expiresAt: 'Hết hạn lúc',
    todayExpires: '(hết hạn hôm nay)',
    daysLeft: '(còn {days} ngày)',
    usedQuota: 'Quota đã dùng',
    resetNow: 'Sắp reset',
    subscriptionType: 'Loại Subscription',
    billingType: 'Loại Billing',
    subscriptionExpires: 'Hết hạn Subscription',
    todayRequests: 'Yêu cầu hôm nay',
    todayInputTokens: 'Input hôm nay',
    todayOutputTokens: 'Output hôm nay',
    todayTokens: 'Tokens hôm nay',
    todayCacheCreation: 'Cache Creation hôm nay',
    todayCacheRead: 'Cache Read hôm nay',
    todayCost: 'Chi phí hôm nay',
    rpmTpm: 'RPM / TPM',
    totalRequests: 'Tổng yêu cầu',
    totalInputTokens: 'Tổng Input',
    totalOutputTokens: 'Tổng Output',
    totalTokensLabel: 'Tổng Tokens',
    totalCacheCreation: 'Tổng Cache Creation',
    totalCacheRead: 'Tổng Cache Read',
    totalCost: 'Tổng chi phí',
    avgDuration: 'Thời gian trung bình',
    enterApiKey: 'Vui lòng nhập API Key',
    querySuccess: 'Truy vấn thành công',
    queryFailed: 'Truy vấn thất bại',
    queryFailedRetry: 'Truy vấn thất bại, vui lòng thử lại sau',
    noDailyUsage: 'Không có dữ liệu sử dụng hàng ngày',
  },

  setup: {
    title: 'Cài đặt Sub2API',
    description: 'Cấu hình instance Sub2API của bạn',
    database: {
      title: 'Cấu hình Database',
      description: 'Kết nối tới database PostgreSQL',
      host: 'Host',
      port: 'Port',
      username: 'Tên đăng nhập',
      password: 'Mật khẩu',
      databaseName: 'Tên database',
      sslMode: 'Chế độ SSL',
      passwordPlaceholder: 'Mật khẩu',
      ssl: {
        disable: 'Tắt',
        require: 'Bắt buộc',
        verifyCa: 'Xác minh CA',
        verifyFull: 'Xác minh đầy đủ'
      }
    },
    redis: {
      title: 'Cấu hình Redis',
      description: 'Kết nối tới Redis server',
      host: 'Host',
      port: 'Port',
      username: 'Tên đăng nhập (tùy chọn)',
      password: 'Mật khẩu (tùy chọn)',
      database: 'Database',
      usernamePlaceholder: 'Để trống để dùng user mặc định',
      passwordPlaceholder: 'Mật khẩu',
      enableTls: 'Bật TLS',
      enableTlsHint: 'Dùng TLS khi kết nối tới Redis (CA cert công khai)'
    },
    admin: {
      title: 'Tài khoản Admin',
      description: 'Tạo tài khoản quản trị viên',
      email: 'Email',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      passwordPlaceholder: 'Tối thiểu 8 ký tự',
      confirmPasswordPlaceholder: 'Xác nhận mật khẩu',
      passwordMismatch: 'Mật khẩu không khớp'
    },
    ready: {
      title: 'Sẵn sàng cài đặt',
      description: 'Kiểm tra cấu hình và hoàn tất cài đặt',
      database: 'Database',
      redis: 'Redis',
      adminEmail: 'Email Admin'
    },
    status: {
      testing: 'Đang kiểm tra...',
      success: 'Kết nối thành công',
      testConnection: 'Kiểm tra kết nối',
      installing: 'Đang cài đặt...',
      completeInstallation: 'Hoàn tất cài đặt',
      completed: 'Cài đặt hoàn tất!',
      redirecting: 'Đang chuyển hướng tới trang đăng nhập...',
      restarting: 'Dịch vụ đang khởi động lại, vui lòng chờ...',
      timeout: 'Dịch vụ khởi động lại lâu hơn dự kiến. Vui lòng tải lại trang thủ công.'
    }
  },
}
